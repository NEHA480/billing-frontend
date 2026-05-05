import { Component, OnInit } from '@angular/core';
import { BillService } from '../services/bill.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  loading = true;

  constructor(private billService: BillService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.billService.getDashboardStats().subscribe({
      next: data => {
        this.stats = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
