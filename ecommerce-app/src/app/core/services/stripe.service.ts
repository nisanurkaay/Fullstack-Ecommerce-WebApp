import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient) {}

  // Stripe PaymentIntent oluşturur
  createPaymentIntent(amount: number): Promise<any> {
    return this.http.post(`${this.baseUrl}/create?amount=${amount}`, {}, { responseType: 'text' }).toPromise();
  }

  // Tam iade
  refundPayment(intentId: string): Promise<any> {
    return this.http.post(`${this.baseUrl}/refund?paymentIntentId=${intentId}`, {}, { responseType: 'text' }).toPromise();
  }

  // Kısmi iade (doğru endpoint)
  partiallyRefundPayment(intentId: string, amount: number): Promise<any> {
    return this.http.post(`${this.baseUrl}/partial-refund?paymentIntentId=${intentId}&amount=${amount}`, {}, { responseType: 'text' }).toPromise();
  }
}
