// src/app/core/services/auth.service.ts
import {
  GoogleLoginProvider,
  SocialAuthService,
  SocialUser
} from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

interface User {
  name: string;
  email: string;
  password?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [];
  private socialUser: SocialUser | null = null;

  constructor(private socialAuth: SocialAuthService) {

    this.socialAuth.authState.subscribe(user => {
      this.socialUser = user;
      if (user) {
        localStorage.setItem('token', user.idToken);
        localStorage.setItem('user', JSON.stringify({
          name: user.name,
          email: user.email,
          role: 'customer'
        }));
      }
    });
  }


  login(credentials: { email: string; password: string }): Observable<any> {
    const user = this.users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    if (user) {
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      return of({ token, user });
    }
    return throwError(() => new Error('Invalid email or password'));
  }


  register(userData: { name: string; email: string; password: string }): Observable<any> {
    const exists = this.users.some(u => u.email === userData.email);
    if (exists) {
      return throwError(() => new Error('User already exists'));
    }
    const newUser: User = { ...userData, role: 'customer' };
    this.users.push(newUser);
    return of({ success: true });
  }


  googleSignIn(): Promise<SocialUser> {
    return this.socialAuth.signIn(GoogleLoginProvider.PROVIDER_ID);
  }


  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (this.socialUser) {
      this.socialAuth.signOut();
      this.socialUser = null;
    }
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  getCurrentUser(): User | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }


  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }
}
