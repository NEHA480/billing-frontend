import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BillService } from '../services/bill.service';
import { Bill } from '../models/bill.model';

@Component({
  selector: 'app-bill-list',
  templateUrl: './bill-list.component.html',
  styleUrls: ['./bill-list.component.css']
})
export class BillListComponent implements OnInit {
  bills: Bill[] = [];
  errorMsg = '';
  successMsg = '';
  totalPages = 0;
  currentPage = 0;
  pageSize = 10;

  filters = { customerName: '', status: '', from: '', to: '' };

  constructor(private billService: BillService, private router: Router) {}

  ngOnInit(): void { this.loadBills(); }

  loadBills(): void {
    const hasFilter = this.filters.customerName || this.filters.status || this.filters.from || this.filters.to;
    const obs = hasFilter
      ? this.billService.search(this.filters, this.currentPage, this.pageSize)
      : this.billService.getAll(this.currentPage, this.pageSize);

    obs.subscribe({
      next: data => { this.bills = data.content; this.totalPages = data.totalPages; },
      error: () => this.errorMsg = 'Failed to load bills.'
    });
  }

  applyFilter(): void { this.currentPage = 0; this.loadBills(); }

  clearFilter(): void { this.filters = { customerName: '', status: '', from: '', to: '' }; this.currentPage = 0; this.loadBills(); }

  changePage(page: number): void { this.currentPage = page; this.loadBills(); }

  edit(id: number): void { this.router.navigate(['/bills/edit', id]); }

  delete(id: number): void {
    if (!confirm('Delete this bill?')) return;
    this.billService.delete(id).subscribe({
      next: () => { this.successMsg = 'Bill deleted.'; this.loadBills(); },
      error: () => this.errorMsg = 'Failed to delete bill.'
    });
  }

  updateStatus(id: number, status: string): void {
    this.billService.updateStatus(id, status).subscribe({
      next: () => { this.successMsg = 'Status updated to ' + status; this.loadBills(); },
      error: () => this.errorMsg = 'Failed to update status.'
    });
  }

  sendReminder(id: number): void {
    this.billService.sendReminder(id).subscribe({
      next: () => this.successMsg = 'Reminder sent!',
      error: () => this.errorMsg = 'Failed to send reminder.'
    });
  }

  downloadPdf(id: number): void {
    this.billService.downloadBillPdf(id).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `bill-${id}.pdf`; a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  downloadAllPdf(): void {
    this.billService.downloadAllPdf().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'all-bills.pdf'; a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  statusClass(status: string): string {
    return status === 'PAID' ? 'paid' : status === 'CANCELLED' ? 'cancelled' : 'pending';
  }
}
