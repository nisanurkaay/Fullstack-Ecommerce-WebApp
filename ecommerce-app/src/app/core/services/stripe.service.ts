import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  private baseUrl = 'http://localhost:8081/api/payments';

  constructor(private http: HttpClient) {}

  createPaymentIntent(amount: number): Promise<string> {
    return this.http
      .post<{ clientSecret: string }>(
        `${this.baseUrl}/create?amount=${amount}`,
        {}
      )
      .toPromise()
      .then((res) => res!.clientSecret);
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
