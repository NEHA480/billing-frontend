import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private url = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string; username: string; role: string }>(
      `${this.url}/login`, { username, password }
    ).pipe(
      tap(res => this.storeSession(res))
    );
  }

  register(username: string, password: string, companyName: string) {
    return this.http.post<{ token: string; username: string; role: string; companyId: number; companyName: string; message: string }>(
      `${this.url}/register`, { username, password, companyName }
    ).pipe(
      tap(res => this.storeSession(res))
    );
  }

  private storeSession(res: { token: string; username: string; role: string; companyId?: number; companyName?: string }) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('username', res.username);
    localStorage.setItem('role', res.role);
    if (res.companyId) localStorage.setItem('companyId', String(res.companyId));
    if (res.companyName) localStorage.setItem('companyName', res.companyName);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyName');
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getUsername(): string | null { return localStorage.getItem('username'); }
  getRole(): string | null { return localStorage.getItem('role'); }
  getCompanyName(): string | null { return localStorage.getItem('companyName'); }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
