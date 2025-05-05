import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8081/api/categories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  create(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }
  getTopCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/top`);
  }

}
