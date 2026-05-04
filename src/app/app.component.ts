import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <nav class="navbar">
      <span class="brand">💳 Billing App</span>
      <a routerLink="/bills">Bills</a>
      <a routerLink="/bills/new">+ New Bill</a>
    </nav>
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .navbar { background:#1976d2; padding:12px 24px; display:flex; align-items:center; gap:20px; }
    .navbar .brand { color:#fff; font-size:1.2rem; font-weight:bold; flex:1; }
    .navbar a { color:#fff; text-decoration:none; font-size:0.95rem; }
    .navbar a:hover { text-decoration:underline; }
    .container { max-width:960px; margin:30px auto; padding:0 16px; }
  `]
})
export class AppComponent {}
