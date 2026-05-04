import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bill } from '../models/bill.model';

@Injectable({ providedIn: 'root' })
export class BillService {
  private apiUrl = '/api/bills';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this.apiUrl);
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

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
