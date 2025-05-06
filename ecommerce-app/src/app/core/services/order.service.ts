// src/app/core/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

export interface OrderItemRequest {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItemRequest[];
  paymentIntentId?: string; // Stripe ödeme varsa eklersin
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8081/api/orders';

  constructor(private http: HttpClient) {}

  createOrderFromCart(cartItems: CartItem[], paymentIntentId?: string): Observable<any> {
    const items: OrderItemRequest[] = cartItems.map(item => ({
      productId: item.product.id!,
      variantId: item.variantId, // null veya undefined olabilir
      quantity: item.quantity
    }));

    const orderRequest: OrderRequest = { items };

    if (paymentIntentId) {
      (orderRequest as any).paymentIntentId = paymentIntentId;
    }

    return this.http.post(this.apiUrl, orderRequest);
  }

  getMyOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  cancelOrderBySeller(orderId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${orderId}/cancel-by-seller`, {});
  }


  updateItemStatus(orderId: number, itemId: number, newStatus: string): Observable<string> {
    const params = new HttpParams().set('status', newStatus);
    return this.http.put(`${this.apiUrl}/${orderId}/items/${itemId}/status`, {}, { params, responseType: 'text' });
  }
  cancelItemBySeller(orderId: number, itemId: number): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${orderId}/items/${itemId}/cancel`, {});
  }


  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`); // Admin ve seller için de aynı endpoint
  }
}
