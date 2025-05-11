// src/app/core/services/order.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { HttpHeaders } from '@angular/common/http';

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
  const token = localStorage.getItem('jwt');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put(
    `${this.apiUrl}/${orderId}/items/${itemId}/cancel`,
    {},
    { headers, responseType: 'text' }
  );
}


  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`); // Admin ve seller için de aynı endpoint
  }
cancelAndRefundOrder(orderId: number): Observable<string> {
  return this.http.put<string>(
    `${this.apiUrl}/${orderId}/cancel-by-seller`, {}
  );
}

}
export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
    variantId?: number;

  /** add this: */
  status: string;
  shipmentStatus?: string;
}

export interface OrderResponse {
  id: number;
  user: { id: number; name: string };
  status: string;
  totalAmount: number;
  createdAt: string;
  paymentIntentId?: string;
  items: OrderItemResponse[];
}
