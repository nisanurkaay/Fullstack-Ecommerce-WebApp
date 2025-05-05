// src/app/core/services/stripe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient) {}
  createPaymentIntent(amount: number): Promise<{ id: string; clientSecret: string }> {
    return this.http.post<{ id: string; clientSecret: string }>(
      `${this.baseUrl}/create`,
      null,
      { params: { amount: amount.toString() } }
    ).toPromise().then(res => {
      if (!res || !res.id || !res.clientSecret) {
        throw new Error("PaymentIntent oluşturulamadı");
      }
      return res;
    });
  }

  // Refund işlemi (gerekirse)
  refundPayment(intentId: string): Promise<any> {
    return this.http.post(`${this.baseUrl}/refund?paymentIntentId=${intentId}`, {}, { responseType: 'text' }).toPromise();
  }
}
