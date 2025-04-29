// src/app/core/services/order.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';
// import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Eğer environment.ts içinde apiUrl tanımlıysa onu kullanabilirsiniz:
  // private baseUrl = `${environment.apiUrl}/orders`;
  private baseUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  /**
   * Yeni sipariş oluşturur.
   * @param orderData Form’dan gelen adres, kart vb. bilgiler
   */
  createOrder(orderData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, orderData);
  }

  /**
   * Kullanıcının geçmiş siparişlerini getirir.
   * @param userId Kullanıcı kimliği
   */
  getOrderHistory(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/history/${userId}`);
  }

  /**
   * Tek bir siparişin detaylarını getirir.
   * @param orderId Sipariş kimliği
   */
  getOrderById(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${orderId}`);
  }

  /**
   * Sipariş takibi için ek bilgi getirir.
   * @param orderId Sipariş kimliği
   */
  trackOrder(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/track/${orderId}`);
  }
}
