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
}

export interface OrderResponse {
  id: number;
  totalAmount: number;
  items: OrderItem[];
}

export interface CategorySold {
  category: string;
  sold: number;
}

// ➊ Yeni DTO tipi
export interface TopSeller {
  sellerId:   number;
  sellerName: string;
  revenue:    number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private baseUrl = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  /** All orders (admin sees all, seller filtered by backend) */
  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.baseUrl}/orders`);
  }

  /** Low stock count */
  getLowStockCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/products/low-stock-count`);
  }

  /** Return rate in % */
  getReturnRate(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/orders/return-rate`);
  }

  /** Top categories, default top 5 */
  getTopCategories(topN: number = 5): Observable<CategorySold[]> {
    return this.http.get<CategorySold[]>(
      `${this.baseUrl}/categories/top-sales?topN=${topN}`
    );
  }

  /** ➋ Yeni metot: Admin için Top Sellers */
  getTopSellers(topN: number = 5): Observable<TopSeller[]> {
    return this.http.get<TopSeller[]>(
      `${this.baseUrl}/orders/top-sellers?topN=${topN}`
    );
  }
}
