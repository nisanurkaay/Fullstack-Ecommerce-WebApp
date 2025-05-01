// src/app/core/guards/seller.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class SellerGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): boolean {
    if (this.auth.getUserRole() !== 'ROLE_SELLER') {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
