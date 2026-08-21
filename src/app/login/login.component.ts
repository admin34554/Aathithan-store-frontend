import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  username = '';
  password = '';

  error = '';
  loading = false;

  showPassword = false;
  rememberMe = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    if (!this.username || !this.password) {
      this.error = 'Please enter both username and password';
      return;
    }

    this.error = '';
    this.loading = true;

    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe({

      next: res => {

        localStorage.setItem('token', res.token);
        localStorage.setItem('companyId', res.companyId);
        localStorage.setItem('companyName', res.companyName);

        this.loading = false;
        this.router.navigate(['']);

      },

      error: () => {
        this.error = 'Invalid Username or Password';
        this.loading = false;
      }

    });

  }

  forgotPassword(event: Event) {
    event.preventDefault();
    // TODO: navigate to a reset-password flow, or open a modal
    // this.router.navigate(['/forgot-password']);
  }

}