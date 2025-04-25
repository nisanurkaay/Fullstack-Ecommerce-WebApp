// src/app/modules/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone:false,
    templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name:            ['', Validators.required],
      email:           ['', [Validators.required, Validators.email]],
      password:        ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordsMatch
    });
  }

  private passwordsMatch(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fix the errors above.';
      return;
    }

    this.errorMessage = '';
    const { name, email, password } = this.registerForm.value;

    this.auth.register({ name, email, password }).subscribe({
      next: () => {
        this.successMessage = 'Registered successfully! Redirecting…';
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1500);
      },
      error: err => this.errorMessage = err.message || 'Registration failed.'
    });
  }
}
