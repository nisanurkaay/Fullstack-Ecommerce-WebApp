
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;
  isSeller = false;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

 // profile.component.ts
ngOnInit(): void {
  this.auth.getCurrentUser().subscribe(user => {
    this.user = user;
    this.isSeller = user.role === 'ROLE_SELLER';
    this.profileForm = this.fb.group({
      name:      [user.name,      Validators.required],
      email:     [user.email,     [Validators.required, Validators.email]],
      corporate:[user.corporate || ''],
      password:  ['', [Validators.minLength(6)]],
      confirmPassword: ['', []]
    }, {
      validators: this.passwordMatchValidator
    });
  });
}

passwordMatchValidator(form: FormGroup) {
  const pw = form.get('password')?.value;
  const cp = form.get('confirmPassword')?.value;
  return pw === cp ? null : { mismatch: true };
}

onSubmit(): void {
  if (this.profileForm.invalid) {
    this.profileForm.markAllAsTouched();
    return;
  }
  const updates: any = { ...this.profileForm.value };
  if (!this.isSeller) delete updates.corporate;
  // If password blank, remove it so backend won’t overwrite
  if (!updates.password) {
    delete updates.password;
    delete updates.confirmPassword;
  }
  delete updates.confirmPassword;

  this.auth.updateProfile(updates).subscribe({
    next: () => alert('Profil güncellendi'),
    error: () => alert('Profil güncellenirken hata oluştu.')
  });
}

}
