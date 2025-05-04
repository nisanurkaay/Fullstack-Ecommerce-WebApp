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
        console.log('✅ Login response:', res);

        const token = res.token ?? res.data?.token;
        const refreshToken = res.refreshToken ?? res.data?.refreshToken;

        if (!token) {
          console.error('❌ Token alınamadı, giriş başarısız.');
          return;
        }

        // 🔐 Token ve bilgiler localStorage'a yazılıyor
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', refreshToken ?? '');
        localStorage.setItem('userId', res.id.toString());

        localStorage.setItem('user', JSON.stringify({
          id: res.id,
          name: res.name,
          role: res.role
        }));

        this.auth.setAccessToken(token); // opsiyonel: service içinde tutmak için
        this.auth.setRefreshToken(refreshToken ?? '');

        // 🔀 Rol yönlendirme
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
