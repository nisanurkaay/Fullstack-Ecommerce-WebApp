import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register-seller',
  templateUrl: './register-seller.component.html',
  styleUrls: ['./register-seller.component.css'],
  standalone: false
})
export class RegisterSellerComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      isIndividual: [true, Validators.required],
      corporate: ['']
    }, { validators: this.passwordMatchValidator });

    // Dinamik olarak "corporate" alanı zorunluluğu
    this.registerForm.get('isIndividual')?.valueChanges.subscribe(value => {
      const corporateControl = this.registerForm.get('corporate');
      if (!value) {
        corporateControl?.setValidators([Validators.required]);
      } else {
        corporateControl?.clearValidators();
      }
      corporateControl?.updateValueAndValidity();
    });
  }


  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

  onRegister(): void {
    if (this.registerForm.invalid) return;

    this.auth.registerSeller(this.registerForm.value).subscribe({
      next: () => {
        this.successMessage = 'Seller registered successfully!';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Registration failed';
      }
    });
  }
}
