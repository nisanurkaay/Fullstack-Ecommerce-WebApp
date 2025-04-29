// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

export type Role = 'customer' | 'seller' | 'admin';

export interface User {
  name: string;
  email: string;
  password?: string;
  role: Role;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // 1) Uygulama genelinde o anki user’ı yayınlamak için BehaviorSubject
  private currentUser$$ = new BehaviorSubject<User | null>(null);

  // 2) Şimdilik bellekte bir kullanıcı listesi (gerçek projede API’den gelir)
  private users: User[] = [
    { name: 'Admin',  email: 'admin@shopago.com',  password: 'admin123',  role: 'admin' },
    { name: 'Seller', email: 'seller@shopago.com', password: 'seller123', role: 'seller' },
    // register ile eklenecek customer’lar da burada tutulur
  ];

  constructor() {
    // sayfa yenilenince localStorage’den oku
    const stored = localStorage.getItem('user');
    if (stored) {
      this.currentUser$$.next(JSON.parse(stored));
    }
  }

  /** Oturum aç */
  login(credentials: { email: string; password: string }): Observable<{ token: string; user: User }> {
    const found = this.users.find(u =>
      u.email === credentials.email && u.password === credentials.password
    );
    if (!found) {
      return throwError(() => new Error('Invalid email or password'));
    }

    // basit "token"
    const token = 'fake-jwt-token';
    // localStorage’a kaydet
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(found));
    // BehaviorSubject'e bildir
    this.currentUser$$.next(found);

    return of({ token, user: found });
  }

  /** Kayıt ol (default rol customer) */
  register(userData: { name: string; email: string; password: string }): Observable<{ success: boolean }> {
    if (this.users.some(u => u.email === userData.email)) {
      return throwError(() => new Error('User already exists'));
    }
    const newUser: User = { ...userData, role: 'customer' };
    this.users.push(newUser);
    return of({ success: true });
  }

  /** Çıkış yap */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser$$.next(null);
  }

  /** Oturum açık mı? */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Observable olarak o anki kullanıcıyı dinle */
  currentUser$(): Observable<User | null> {
    return this.currentUser$$.asObservable();
  }

  /** Senkron olarak anlık kullanıcıyı döner */
  getCurrentUser(): User | null {
    return this.currentUser$$.value;
  }

  /** Kullanıcının rolünü döner */
  getUserRole(): Role {
    return this.getCurrentUser()?.role || 'customer';
  }

  /** Şifre unutma (dummy) */
  forgotPassword(email: string): Observable<{ success: boolean }> {
    // gerçekte e-posta ile token atarsın
    return of({ success: true });
  }
}
