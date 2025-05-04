import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getSellers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/sellers`);
  }

  banUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/ban`, {});
  }

  unbanUser(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/unban`, {});
  }
}
