import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { BillService } from '../services/bill.service';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let billServiceMock: jasmine.SpyObj<BillService>;

  const mockStats = { totalBills: 10, totalAmount: 5000, pendingCount: 4, paidCount: 5, cancelledCount: 1, pendingAmount: 2000, paidAmount: 3000 };

  beforeEach(async () => {
    billServiceMock = jasmine.createSpyObj('BillService', ['getDashboardStats']);
    billServiceMock.getDashboardStats.and.returnValue(of(mockStats));

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [CommonModule, RouterTestingModule],
      providers: [{ provide: BillService, useValue: billServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load stats on init', () => {
    expect(component.stats.totalBills).toBe(10);
    expect(component.stats.totalAmount).toBe(5000);
    expect(component.stats.pendingCount).toBe(4);
    expect(component.stats.paidCount).toBe(5);
    expect(component.loading).toBeFalse();
  });

  it('should set loading false on error', () => {
    billServiceMock.getDashboardStats.and.returnValue(throwError(() => new Error('error')));
    component.loadStats();
    expect(component.loading).toBeFalse();
  });
});
