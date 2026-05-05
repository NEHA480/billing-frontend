import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuditLogComponent } from './audit-log.component';
import { BillService } from '../services/bill.service';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';

describe('AuditLogComponent', () => {
  let component: AuditLogComponent;
  let fixture: ComponentFixture<AuditLogComponent>;
  let billServiceMock: jasmine.SpyObj<BillService>;

  const mockLogs = { content: [{ action: 'CREATE_BILL', performedBy: 'admin', details: 'Created bill #1', timestamp: new Date() }], totalPages: 2 };

  beforeEach(async () => {
    billServiceMock = jasmine.createSpyObj('BillService', ['getAuditLogs']);
    billServiceMock.getAuditLogs.and.returnValue(of(mockLogs));

    await TestBed.configureTestingModule({
      declarations: [AuditLogComponent],
      imports: [CommonModule],
      providers: [{ provide: BillService, useValue: billServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load logs on init', () => {
    expect(component.logs.length).toBe(1);
    expect(component.logs[0].action).toBe('CREATE_BILL');
    expect(component.totalPages).toBe(2);
  });

  it('changePage() should update currentPage and reload', () => {
    component.changePage(1);
    expect(component.currentPage).toBe(1);
    expect(billServiceMock.getAuditLogs).toHaveBeenCalledWith(1);
  });
});
