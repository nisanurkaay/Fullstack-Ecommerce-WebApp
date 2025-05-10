// src/app/core/services/analytics.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  sellerId: number;
  sellerName?: string; // eğer backend’den geliyorsa
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  items: OrderItem[];
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  amountSold: number;
  totalRevenue: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
     private apiUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.apiUrl}/orders`);
  }

  getAllProducts(): Observable<ProductResponse[]> {
    return this.http.get<ProductResponse[]>(`${this.apiUrl}/products/all`);
  }
}
