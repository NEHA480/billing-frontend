import { Component, OnInit } from '@angular/core';
import { BillService } from '../services/bill.service';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  logs: any[] = [];
  totalPages = 0;
  currentPage = 0;

  constructor(private billService: BillService) {}

  ngOnInit(): void { this.loadLogs(); }

  loadLogs(): void {
    this.billService.getAuditLogs(this.currentPage).subscribe({
      next: data => { this.logs = data.content; this.totalPages = data.totalPages; }
    });
  }

  changePage(page: number): void { this.currentPage = page; this.loadLogs(); }
}
