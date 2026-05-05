import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar">
      <span class="brand">🧾 Billing App</span>

      <ng-container *ngIf="authService.isLoggedIn()">
        <a routerLink="/dashboard" routerLinkActive="active-link">📊 Dashboard</a>
        <a routerLink="/bills" routerLinkActive="active-link">📄 Bills</a>
        <a routerLink="/bills/new" routerLinkActive="active-link">+ New Bill</a>
        <a routerLink="/audit" routerLinkActive="active-link">📋 Audit Log</a>
        <a routerLink="/profile" routerLinkActive="active-link">👤 My Profile</a>
      </ng-container>

      <span class="spacer"></span>

      <ng-container *ngIf="authService.isLoggedIn()">
        <span class="username">🏢 {{ authService.getCompanyName() }} | 👤 {{ authService.getUsername() }}</span>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </ng-container>

      <ng-container *ngIf="!authService.isLoggedIn()">
        <a routerLink="/login" class="login-btn" routerLinkActive="active-btn">Login</a>
        <a routerLink="/register" class="register-btn" routerLinkActive="active-btn">Register</a>
      </ng-container>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 12px 24px; display: flex; align-items: center; gap: 16px; }
    .navbar .brand { color: #fff; font-size: 1.2rem; font-weight: bold; }
    .navbar a { color: #fff; text-decoration: none; font-size: 0.95rem; }
    .navbar a:hover { text-decoration: underline; }
    .spacer { flex: 1; }
    .username { color: #fff; font-size: 0.9rem; }
    .login-btn { padding: 7px 18px; border-radius: 4px; border: 2px solid #fff; color: #fff; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
    .login-btn:hover { background: rgba(255,255,255,0.2); text-decoration: none; }
    .register-btn { padding: 7px 18px; border-radius: 4px; background: #fff; color: #764ba2; font-weight: 600; text-decoration: none; font-size: 0.9rem; border: 2px solid #fff; }
    .register-btn:hover { background: #f0e6ff; text-decoration: none; }
    .active-btn { background: #fff !important; color: #764ba2 !important; }
    .logout-btn { padding: 7px 18px; border-radius: 4px; background: #e53935; color: #fff; font-weight: 600; border: none; cursor: pointer; font-size: 0.9rem; }
    .logout-btn:hover { background: #c62828; }
    .active-link { font-weight: 700; text-decoration: underline !important; }
    .container { max-width: 960px; margin: 30px auto; padding: 0 16px; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
