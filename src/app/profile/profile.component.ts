import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any = null;
  error = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.http.get('http://localhost:8080/api/auth/me').subscribe({
      next: (data) => this.user = data,
      error: () => this.error = 'Failed to load user details.'
    });
  }
}
