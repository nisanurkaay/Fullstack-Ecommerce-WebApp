import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone:false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.auth.login(this.loginForm.value).subscribe({
      next: res => {
        const role = res.role || JSON.parse(localStorage.getItem('user') || '{}').role;

        if (role === 'ROLE_SELLER') {
          this.router.navigate(['/seller/dashboard']);
        }
        else if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        }
        else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        if (err.status === 401) {
          this.error = err.error?.message || 'Invalid credentials'; }
          else {
        this.error = err.message || 'Login failed';}
      }
    });

  }

}
