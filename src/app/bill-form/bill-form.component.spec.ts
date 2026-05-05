import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BillFormComponent } from './bill-form.component';
import { BillService } from '../services/bill.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Bill } from '../models/bill.model';

describe('BillFormComponent', () => {
  let component: BillFormComponent;
  let fixture: ComponentFixture<BillFormComponent>;
  let billServiceMock: jasmine.SpyObj<BillService>;
  let routerMock: jasmine.SpyObj<Router>;

  const mockBill: Bill = {
    id: 1,
    customerName: 'John Doe',
    description: 'Monthly bill',
    amount: 500,
    status: 'PENDING',
    billDate: '2026-05-04'
  };

  beforeEach(async () => {
    billServiceMock = jasmine.createSpyObj('BillService', ['getById', 'create', 'update']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [BillFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: BillService, useValue: billServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BillFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('status')?.value).toBe('PENDING');
    expect(component.isEdit).toBeFalse();
  });

  it('form should be invalid when empty', () => {
    component.form.reset();
    expect(component.form.invalid).toBeTrue();
  });

  it('form should be valid with all required fields', () => {
    component.form.setValue({
      customerName: 'John Doe',
      description: 'Monthly bill',
      amount: 500,
      status: 'PENDING',
      billDate: '2026-05-04'
    });
    expect(component.form.valid).toBeTrue();
  });

  it('submit() should call create and navigate on success', () => {
    billServiceMock.create.and.returnValue(of(mockBill));
    component.form.setValue({
      customerName: 'John Doe',
      description: 'Monthly bill',
      amount: 500,
      status: 'PENDING',
      billDate: '2026-05-04'
    });
    component.submit();
    expect(billServiceMock.create).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/bills']);
  });

  it('submit() should set errorMsg on failure', () => {
    billServiceMock.create.and.returnValue(throwError(() => ({ message: 'Server error' })));
    component.form.setValue({
      customerName: 'John Doe',
      description: 'Monthly bill',
      amount: 500,
      status: 'PENDING',
      billDate: '2026-05-04'
    });
    component.submit();
    expect(component.errorMsg).toContain('Failed to save bill');
  });

  it('cancel() should navigate to /bills', () => {
    component.cancel();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/bills']);
  });
});
