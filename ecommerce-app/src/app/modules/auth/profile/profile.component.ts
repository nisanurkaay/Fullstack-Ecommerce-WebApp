// src/app/modules/profile/profile.component.ts
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

  ngOnInit(): void {
    this.auth.getCurrentUser().subscribe({
      next: user => {
        this.user = user;
        this.isSeller = user.role === 'ROLE_SELLER';

        this.profileForm = this.fb.group({
          name: [user.name, Validators.required],
          email: [user.email, [Validators.required, Validators.email]],
          corporate: [user.corporate || '']
        });
      },
      error: () => alert('Yetkisiz erişim!')
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const updates = this.profileForm.value;
    if (!this.isSeller) delete updates.corporate;

    this.auth.updateProfile(updates).subscribe({
      next: () => alert('Profil güncellendi'),
      error: () => alert('Profil güncellenirken hata oluştu.')
    });
  }
}
