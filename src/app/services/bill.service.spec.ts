import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BillService } from './bill.service';
import { Bill } from '../models/bill.model';

describe('BillService', () => {
  let service: BillService;
  let httpMock: HttpTestingController;

  const mockBill: Bill = { id: 1, customerName: 'John Doe', description: 'Monthly bill', amount: 500, status: 'PENDING', billDate: '2026-05-04' };
  const mockPage = { content: [mockBill], totalPages: 1, totalElements: 1 };

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [BillService] });
    service = TestBed.inject(BillService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => expect(service).toBeTruthy());

  it('getAll() should return paginated bills', () => {
    service.getAll(0, 10).subscribe(res => { expect(res.content.length).toBe(1); expect(res.content[0].customerName).toBe('John Doe'); });
    const req = httpMock.expectOne(r => r.url === '/api/bills');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('search() should return filtered bills', () => {
    service.search({ customerName: 'John', status: 'PENDING' }, 0, 10).subscribe(res => expect(res.content.length).toBe(1));
    const req = httpMock.expectOne(r => r.url === '/api/bills/search');
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('getById() should return a bill', () => {
    service.getById(1).subscribe(bill => expect(bill.customerName).toBe('John Doe'));
    const req = httpMock.expectOne('/api/bills/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockBill);
  });

  it('create() should post and return bill', () => {
    service.create(mockBill).subscribe(bill => expect(bill.id).toBe(1));
    const req = httpMock.expectOne('/api/bills');
    expect(req.request.method).toBe('POST');
    req.flush(mockBill);
  });

  it('update() should put and return updated bill', () => {
    service.update(1, mockBill).subscribe(bill => expect(bill.customerName).toBe('John Doe'));
    const req = httpMock.expectOne('/api/bills/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockBill);
  });

  it('updateStatus() should patch status', () => {
    service.updateStatus(1, 'PAID').subscribe(bill => expect(bill.status).toBe('PAID'));
    const req = httpMock.expectOne('/api/bills/1/status');
    expect(req.request.method).toBe('PATCH');
    req.flush({ ...mockBill, status: 'PAID' });
  });

  it('delete() should send DELETE request', () => {
    service.delete(1).subscribe(res => expect(res).toBe('deleted'));
    const req = httpMock.expectOne('/api/bills/1');
    expect(req.request.method).toBe('DELETE');
    req.flush('deleted');
  });

  it('sendReminder() should post to remind endpoint', () => {
    service.sendReminder(1).subscribe(res => expect(res).toBe('Reminder sent'));
    const req = httpMock.expectOne('/api/bills/1/remind');
    expect(req.request.method).toBe('POST');
    req.flush('Reminder sent');
  });

  it('downloadBillPdf() should return blob', () => {
    service.downloadBillPdf(1).subscribe(blob => expect(blob).toBeTruthy());
    const req = httpMock.expectOne('/api/bills/1/pdf');
    expect(req.request.method).toBe('GET');
    req.flush(new Blob());
  });

  it('downloadAllPdf() should return blob', () => {
    service.downloadAllPdf().subscribe(blob => expect(blob).toBeTruthy());
    const req = httpMock.expectOne('/api/bills/pdf/all');
    expect(req.request.method).toBe('GET');
    req.flush(new Blob());
  });

  it('getDashboardStats() should return stats', () => {
    const stats = { totalBills: 5, totalAmount: 2500, pendingCount: 2, paidCount: 3, cancelledCount: 0 };
    service.getDashboardStats().subscribe(res => expect(res.totalBills).toBe(5));
    const req = httpMock.expectOne('/api/dashboard/stats');
    expect(req.request.method).toBe('GET');
    req.flush(stats);
  });

  it('getAuditLogs() should return paginated logs', () => {
    const logs = { content: [{ action: 'CREATE_BILL', performedBy: 'admin' }], totalPages: 1 };
    service.getAuditLogs(0, 20).subscribe(res => expect(res.content.length).toBe(1));
    const req = httpMock.expectOne(r => r.url === '/api/audit');
    expect(req.request.method).toBe('GET');
    req.flush(logs);
  });
});
