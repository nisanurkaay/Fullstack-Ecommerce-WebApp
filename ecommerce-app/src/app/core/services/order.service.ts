// src/app/core/services/order.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Eğer environment.ts içinde apiUrl tanımlıysa onu kullanabilirsiniz:
// import { environment } from '../../../environments/environment';

export interface Order {
  id: string;
  fullName: string;
  address: string;
  city: string;
  zip: string;
  items?: any[];      // isterseniz kendi tipinizi yazın
  total?: number;
  status?: string;
  createdAt?: string;
  // ...gerekiyorsa diğer alanlar...
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  // Gerçek backend URL’inizi buraya yazın:
  // private baseUrl = `${environment.apiUrl}/orders`;
  private baseUrl = 'http://localhost:3000/api/orders';

  constructor(private http: HttpClient) { }

  /**
   * Yeni sipariş oluşturur.
   */
  createOrder(orderData: any): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, orderData);
  }

  /**
   * Tüm siparişleri getirir (admin paneli için).
   */
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /**
   * Kullanıcının geçmiş siparişlerini getirir.
   * @param userId Kullanıcı kimliği
   */
  getOrderHistory(userId: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/history/${userId}`);
  }

  /**
   * Tek bir siparişin detaylarını getirir.
   * @param orderId Sipariş kimliği
   */
  getOrderById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }

  /**
   * Sipariş takibi için ek bilgi getirir.
   * @param orderId Sipariş kimliği
   */
  trackOrder(orderId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/track/${orderId}`);
  }
}
