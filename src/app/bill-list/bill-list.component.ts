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

  constructor(private billService: BillService, private router: Router) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.billService.getAll().subscribe({
      next: data => this.bills = data,
      error: () => this.errorMsg = 'Failed to load bills.'
    });
  }

  edit(id: number): void {
    this.router.navigate(['/bills/edit', id]);
  }

  delete(id: number): void {
    if (!confirm('Delete this bill?')) return;
    this.billService.delete(id).subscribe({
      next: () => this.loadBills(),
      error: () => this.errorMsg = 'Failed to delete bill.'
    });
  }

  statusClass(status: string): string {
    return status === 'PAID' ? 'paid' : status === 'CANCELLED' ? 'cancelled' : 'pending';
  }
}
