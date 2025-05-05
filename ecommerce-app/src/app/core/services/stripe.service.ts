// src/app/core/services/stripe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient) {}

  // Backend'te PaymentIntent oluşturur (kuruş cinsinden gönder)
  createPaymentIntent(amount: number): Promise<any> {
    return this.http.post(`${this.baseUrl}/create?amount=${amount}`, {}, { responseType: 'text' }).toPromise();
  }

  // Refund işlemi (gerekirse)
  refundPayment(intentId: string): Promise<any> {
    return this.http.post(`${this.baseUrl}/refund?paymentIntentId=${intentId}`, {}, { responseType: 'text' }).toPromise();
  }
}
