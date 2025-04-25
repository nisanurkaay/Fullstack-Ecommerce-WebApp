// src/app/auth/login/login.component.ts
import { SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.error = null;

    this.auth.login(this.loginForm.value).subscribe({
      next: () => this.router.navigateByUrl('/products'),
      error: err => this.error = err.message || 'Login failed'
    });
  }


  onGoogleSignIn(): void {
    this.auth.googleSignIn()
      .then((user: SocialUser) => {

        this.router.navigateByUrl('/products');
      })
      .catch(err => this.error = 'Google login failed');
  }
}
