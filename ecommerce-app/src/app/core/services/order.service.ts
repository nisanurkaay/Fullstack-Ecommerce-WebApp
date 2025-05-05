// src/app/core/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
}
