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

  constructor() {}

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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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
