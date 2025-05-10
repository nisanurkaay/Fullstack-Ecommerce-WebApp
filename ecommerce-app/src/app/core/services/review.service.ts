// src/app/core/services/review.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from '../../../environments/environment';
export interface CreateReviewPayload {
  productId: number;
  rating: number;
  comment: string;
  orderId: number;
}

export interface ReviewResponse {
  id: number;
  productId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  reviewDate: string;
  orderId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  // === Dev-mode için sahte veri ===
  private mockReviews: Review[] = [
    { id: 1, reviewerName: 'Alice', rating: 5, comment: 'Excellent!', date: '2025-04-20', productId: 101 },
    { id: 2, reviewerName: 'Bob',   rating: 4, comment: 'Very good', date: '2025-04-22', productId: 102 },
    { id: 3, reviewerName: 'Charlie', rating: 3, comment: 'Average', date: '2025-04-23', productId: 101 },
  ];
  private useMock = false;  // → true yaparsan mockReviews döner

  constructor(private http: HttpClient) {}

  /**
   * Ürüne ait yorumları getirir.
   * mock açık değilse backend’den çeker: /api/reviews/product/{productId}
   */
  getReviewsByProductId(productId: number): Observable<Review[]> {
    if (this.useMock) {
      const filtered = this.mockReviews.filter(r => r.productId === productId);
      return of(filtered);
    }
    return this.http.get<Review[]>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  /**
   * Yeni bir yorum oluşturur.
   * Backend: POST /api/reviews
   */
  createReview(payload: CreateReviewPayload): Observable<ReviewResponse> {
    if (this.useMock) {
      // mock flow: yeni objeyi döndür
      const fake: ReviewResponse = {
        id: Date.now(),
        productId: payload.productId,
        reviewerName: 'You',
        rating: payload.rating,
        comment: payload.comment,
        reviewDate: new Date().toISOString(),
        orderId: payload.orderId
      };
      this.mockReviews.unshift({
        id: fake.id,
        reviewerName: fake.reviewerName,
        rating: fake.rating,
        comment: fake.comment,
        date: fake.reviewDate,
        productId: fake.productId
      });
      return of(fake);
    }
    return this.http.post<ReviewResponse>(
      this.apiUrl,
      payload
    );
  }
}
