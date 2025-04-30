// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

export type Role = 'customer' | 'seller' | 'admin';

export interface User {
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
  birthDate?: string;
  corporate?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /** O anki user’ı uygulamanın her yerinde yayınlamak için */
  private currentUser$$ = new BehaviorSubject<User | null>(null);

  /** Subscribe etmek isteyen bileşenler için */
  public currentUser$ = this.currentUser$$.asObservable();

  /** Sahte kullanıcı havuzu (back-end yerine) */
  private users: User[] = [
    { name: 'Admin',  email: 'admin@shopago.com',  password: 'admin123',  role: 'admin' },
    { name: 'Seller', email: 'seller@shopago.com', password: 'seller123', role: 'seller' },
    // register ile eklenen customer’lar da eklenecek
  ];

  constructor() {
    // Sayfa yenilenince localStorage’den oku, BehaviorSubject’i güncelle
    const raw = localStorage.getItem('user');
    if (raw) {
      this.currentUser$$.next(JSON.parse(raw));
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

    const token = 'fake-jwt-token';
    localStorage.setItem('token', token);
    // Sadece posta/parola değil, tüm user bilgisini saklıyoruz
    localStorage.setItem('user', JSON.stringify(found));
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

  /** Oturumu kapat */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser$$.next(null);
  }

  /** Oturum açık mı? */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /** Anlık user bilgisini senkron döner */
  getCurrentUser(): User | null {
    return this.currentUser$$.value;
  }

  /** Kullanıcının rolünü döner */
  getUserRole(): Role {
    return this.getCurrentUser()?.role || 'customer';
  }

  /** Şifre unutma (dummy) */
  forgotPassword(email: string): Observable<{ success: boolean }> {
    return of({ success: true });
  }

  /**
   * Profili günceller
   * - LocalStorage’a yazar
   * - BehaviorSubject’e next() ile yeni user’ı iter
   */
  updateProfile(updates: Partial<Pick<User, 'name' | 'email' | 'phone' | 'birthDate' | 'corporate'>>): void {
    const raw = localStorage.getItem('user');
    if (!raw) return;
    const user: User = JSON.parse(raw);
    const updated: User = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updated));
    this.currentUser$$.next(updated);
  }
}
