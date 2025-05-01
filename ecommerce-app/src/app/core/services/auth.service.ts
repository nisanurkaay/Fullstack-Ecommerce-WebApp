import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, Role } from '../models/user.model';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser$$ = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUser$$.asObservable();
  public readonly apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {
    console.log('✅ AuthService initialized');
    const raw = localStorage.getItem('user');
    if (raw && raw !== 'undefined' && raw !== 'null') {
      try {
        const user = JSON.parse(raw);
        if (user?.name) this.currentUser$$.next(user);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

  }

  // 🔐 LOGIN
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem('accessToken', res.token);

        localStorage.setItem('refreshToken', res.refreshToken);
        const user = { name: res.name, role: res.role, email: credentials.email };
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser$$.next(user);
      })
    );
  }

  // 🆕 REGISTER
  register(data: { name: string; email: string; password: string; corporate?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  registerSeller(data: { name: string; email: string; password: string; corporate: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register-seller`, data);
  }
  // 🔁 REFRESH TOKEN
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post(`${this.apiUrl}/refresh-token`, { refreshToken });
  }

  // 📄 GET CURRENT USER
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  // 📝 UPDATE PROFILE
  updateProfile(updates: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/me`, updates);
  }

  // 📧 FORGOT PASSWORD
  forgotPassword(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/forgot-password`, { email });
  }

  // 🔓 LOGOUT
  logout(): void {
    localStorage.clear();
    this.currentUser$$.next(null);
  }

  // 🚦 IS LOGGED IN
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // 📦 TOKENS
  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // 👤 GET USER ROLE
  getUserRole(): Role {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : 'ROLE_USER';
  }
}
