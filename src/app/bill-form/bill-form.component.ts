import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BillService } from '../services/bill.service';

@Component({
  selector: 'app-bill-form',
  templateUrl: './bill-form.component.html',
  styleUrls: ['./bill-form.component.css']
})
export class BillFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  billId!: number;
  errorMsg = '';
  statuses = ['PENDING', 'PAID', 'CANCELLED'];

  constructor(
    private fb: FormBuilder,
    private billService: BillService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      status: ['PENDING', Validators.required],
      billDate: ['', Validators.required]
    });

    this.billId = this.route.snapshot.params['id'];
    if (this.billId) {
      this.isEdit = true;
      this.billService.getById(this.billId).subscribe({
        next: bill => this.form.patchValue(bill),
        error: () => this.errorMsg = 'Failed to load bill.'
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;
    const bill = this.form.value;
    const request = this.isEdit
      ? this.billService.update(this.billId, bill)
      : this.billService.create(bill);

    request.subscribe({
      next: () => this.router.navigate(['/bills']),
      error: (err) => this.errorMsg = 'Failed to save bill: ' + (err?.error?.message || err?.message || JSON.stringify(err))
    });
  }

  cancel(): void {
    this.router.navigate(['/bills']);
  }
}
