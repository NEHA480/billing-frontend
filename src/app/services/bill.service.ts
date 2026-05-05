import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillService {
  private apiUrl = '/api/bills';

  constructor(private http: HttpClient) {}

  getAll(page = 0, size = 10, sortBy = 'id'): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size).set('sortBy', sortBy);
    return this.http.get<any>(this.apiUrl, { params });
  }

  search(filters: any, page = 0, size = 10): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (filters.customerName) params = params.set('customerName', filters.customerName);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    return this.http.get<any>(`${this.apiUrl}/search`, { params });
  }

  getById(id: number): Observable<Bill> {
    return this.http.get<Bill>(`${this.apiUrl}/${id}`);
  }

  create(bill: Bill): Observable<Bill> {
    return this.http.post<Bill>(this.apiUrl, bill);
  }

  update(id: number, bill: Bill): Observable<Bill> {
    return this.http.put<Bill>(`${this.apiUrl}/${id}`, bill);
  }

  updateStatus(id: number, status: string): Observable<Bill> {
    return this.http.patch<Bill>(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  sendReminder(id: number): Observable<string> {
    return this.http.post(`${this.apiUrl}/${id}/remind`, {}, { responseType: 'text' });
  }

  downloadBillPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/pdf`, { responseType: 'blob' });
  }

  downloadAllPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pdf/all`, { responseType: 'blob' });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>('/api/dashboard/stats');
  }

  getAuditLogs(page = 0, size = 20): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>('/api/audit', { params });
  }
}
