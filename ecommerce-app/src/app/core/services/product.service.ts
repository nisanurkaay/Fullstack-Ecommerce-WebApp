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
  deleteVariant(productId: number, variantId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}/variants/${variantId}`);
  }

  hardDelete(productId: number, sellerId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}?sellerId=${sellerId}`);
  }



  updateRaw(productId: number, formData: FormData, sellerId: number): Observable<any> {
    const url = `${this.apiUrl}/${productId}?sellerId=${sellerId}`;  // 👈 DOĞRU HALİ
    return this.http.put(url, formData);
  }

  activate(id: number, userId: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/activate?userId=${userId}`, {});
  }
  deactivate(id: number, userId: number): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}/deactivate?userId=${userId}`, {});
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
  filterMyProducts(categoryId: number | null, colors: string[], sizes: string[], userId: number): Observable<Product[]> {
    const params = new URLSearchParams();
    if (categoryId) params.append('categoryId', categoryId.toString());
    if (colors.length) params.append('colors', colors.join(','));
    if (sizes.length) params.append('sizes', sizes.join(','));
    params.append('userId', userId.toString());

    return this.http.get<Product[]>(`${this.apiUrl}/filter?${params.toString()}`);
  }
  getColors(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/colors`); // ✅ Template literal düzeltildi
  }
}
