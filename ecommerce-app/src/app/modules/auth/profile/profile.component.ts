// src/app/modules/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../core/models/user.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone:false
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user!: User;

  constructor(private fb: FormBuilder, private auth: AuthService) {}

  ngOnInit(): void {
    const u = this.auth.getCurrentUser();
    if (!u) throw new Error('Yetkisiz');
    this.user = u;
    this.profileForm = this.fb.group({
      name:      [u.name,       Validators.required],
      email:     [u.email,      [Validators.required, Validators.email]],
      phone:     [u.phone||'',  Validators.pattern(/^\+?\d{7,15}$/)],
      birthDate: [u.birthDate||'', Validators.required],
      corporate: [!!u.corporate],
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.auth.updateProfile(this.profileForm.value);
    alert('Profiliniz başarıyla güncellendi.');
  }
}
