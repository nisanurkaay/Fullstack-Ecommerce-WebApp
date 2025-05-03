// ✅ product.service.ts (updated to use Spring Boot backend)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product,ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  create(product: Product, sellerId: number): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}?sellerId=${sellerId}`, product);
  }


  update(id: number, product: Product, userId: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}?userId=${userId}`, product);
  }

  activate(id: number, userId: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/activate?userId=${userId}`, {});
  }

  getPendingProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/pending`);
  }

  approveProduct(productId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${productId}/approve`, {});
  }

  denyProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin-ban/${productId}`);
  }
  delete(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
  }

  approve(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/approve`, {});
  }

  deny(id: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/deny`, {});
  }

  getPending(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/pending`);
  }
  getMyProducts(sellerId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/my?sellerId=${sellerId}`);
  }
  createRaw(formData: FormData, sellerId: number): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}?sellerId=${sellerId}`, formData);
  }
  addVariantToProduct(productId: number, variant: ProductVariant): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${productId}/add-variant`, variant);
  }

}
