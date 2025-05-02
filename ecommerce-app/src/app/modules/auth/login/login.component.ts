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
        console.log('Login response:', res); // ✅
        localStorage.setItem('userId', res.id.toString());
        localStorage.setItem('accessToken', res.token); // ✅ Bu satır olmazsa interceptor çalışmaz!
        localStorage.setItem('user', JSON.stringify({
          id: res.id,
          name: res.name,
          role: res.role
        }));

        this.auth.setRefreshToken(res.refreshToken); // varsa
        const role = res.role;

        if (role === 'ROLE_SELLER') {
          this.router.navigate(['/seller/dashboard']);
        } else if (role === 'ROLE_ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.error = err.status === 401
          ? err.error?.message || 'Invalid credentials'
          : err.message || 'Login failed';
      }
    });
  }

}
