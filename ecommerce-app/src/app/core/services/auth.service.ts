import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, Role } from '../models/user.model';
import { jwtDecode  } from 'jwt-decode';

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
        console.log('[LOGIN] Saving tokens:', res);

        // ✅ ACCESS ve REFRESH token'ı düzgün kaydet
        localStorage.setItem('accessToken', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('email', res.email);
        // ✅ user bilgilerini de kaydet
        localStorage.setItem('user', JSON.stringify({
          id: res.id,
          name: res.name,
          role: res.role,
          email: credentials.email
        }));

        // Eğer varsa BehaviorSubject gibi şeyleri de burada tetikle
        this.currentUser$$.next({
          id: res.id,
          name: res.name,
          role: res.role,
          email: credentials.email
        });
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
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    console.log('📦 Sending refresh token to backend:', refreshToken);
    if (!refreshToken || refreshToken === 'undefined') {
      return throwError(() => new Error('Refresh token not found'));
    }
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

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  setAccessToken(token: string): void {
    console.log('✅ [AuthService] Setting new access token:', token);
    localStorage.setItem('accessToken', token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  getCurrentUserEmail(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      return decoded?.sub || decoded?.email || null; // email genelde 'sub' veya 'email' alanında olur
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }
  // 👤 GET USER ROLE
  getUserRole(): Role {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).role : 'ROLE_USER';
  }
}
