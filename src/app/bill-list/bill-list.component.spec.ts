import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillListComponent } from './bill-list.component';
import { BillService } from '../services/bill.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { Bill } from '../models/bill.model';

describe('BillListComponent', () => {
  let component: BillListComponent;
  let fixture: ComponentFixture<BillListComponent>;
  let billServiceMock: jasmine.SpyObj<BillService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockBills: Bill[] = [
    { id: 1, customerName: 'John Doe', description: 'Bill 1', amount: 500, status: 'PENDING', billDate: '2026-05-04' },
    { id: 2, customerName: 'Jane Doe', description: 'Bill 2', amount: 300, status: 'PAID', billDate: '2026-05-03' }
  ];
  const mockPage = { content: mockBills, totalPages: 2, totalElements: 2 };

  beforeEach(async () => {
    billServiceMock = jasmine.createSpyObj('BillService', ['getAll', 'search', 'delete', 'updateStatus', 'sendReminder', 'downloadBillPdf', 'downloadAllPdf']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    billServiceMock.getAll.and.returnValue(of(mockPage));

    await TestBed.configureTestingModule({
      declarations: [BillListComponent],
      imports: [FormsModule, CommonModule],
      providers: [
        { provide: BillService, useValue: billServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load bills on init', () => {
    expect(component.bills.length).toBe(2);
    expect(component.totalPages).toBe(2);
  });

  it('should set errorMsg on load failure', () => {
    billServiceMock.getAll.and.returnValue(throwError(() => new Error('error')));
    component.loadBills();
    expect(component.errorMsg).toBe('Failed to load bills.');
  });

  it('applyFilter() should call search when filter is set', () => {
    billServiceMock.search.and.returnValue(of(mockPage));
    component.filters.customerName = 'John';
    component.applyFilter();
    expect(billServiceMock.search).toHaveBeenCalled();
    expect(component.currentPage).toBe(0);
  });

  it('clearFilter() should reset filters and reload', () => {
    component.filters.customerName = 'John';
    component.clearFilter();
    expect(component.filters.customerName).toBe('');
    expect(billServiceMock.getAll).toHaveBeenCalled();
  });

  it('changePage() should update currentPage and reload', () => {
    component.changePage(2);
    expect(component.currentPage).toBe(2);
    expect(billServiceMock.getAll).toHaveBeenCalled();
  });

  it('edit() should navigate to edit route', () => {
    component.edit(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/bills/edit', 1]);
  });

  it('delete() should reload bills after deletion', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    billServiceMock.delete.and.returnValue(of('deleted'));
    component.delete(1);
    expect(billServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.successMsg).toBe('Bill deleted.');
  });

  it('delete() should set errorMsg on failure', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    billServiceMock.delete.and.returnValue(throwError(() => new Error('error')));
    component.delete(1);
    expect(component.errorMsg).toBe('Failed to delete bill.');
  });

  it('updateStatus() should update status and show success', () => {
    billServiceMock.updateStatus.and.returnValue(of({ ...mockBills[0], status: 'PAID' }));
    component.updateStatus(1, 'PAID');
    expect(component.successMsg).toBe('Status updated to PAID');
  });

  it('updateStatus() should set errorMsg on failure', () => {
    billServiceMock.updateStatus.and.returnValue(throwError(() => new Error('error')));
    component.updateStatus(1, 'PAID');
    expect(component.errorMsg).toBe('Failed to update status.');
  });

  it('sendReminder() should show success message', () => {
    billServiceMock.sendReminder.and.returnValue(of('Reminder sent'));
    component.sendReminder(1);
    expect(component.successMsg).toBe('Reminder sent!');
  });

  it('sendReminder() should set errorMsg on failure', () => {
    billServiceMock.sendReminder.and.returnValue(throwError(() => new Error('error')));
    component.sendReminder(1);
    expect(component.errorMsg).toBe('Failed to send reminder.');
  });

  it('statusClass() should return correct class', () => {
    expect(component.statusClass('PAID')).toBe('paid');
    expect(component.statusClass('CANCELLED')).toBe('cancelled');
    expect(component.statusClass('PENDING')).toBe('pending');
  });
});
