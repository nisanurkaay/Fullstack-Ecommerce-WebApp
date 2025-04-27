import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Review } from '../models/review.model'; // Şu anlık buradan import

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private reviews: Review[] = [
    { id: 1, reviewerName: 'Alice', rating: 5, comment: 'Excellent!', date: '2025-04-20', productId: 101 },
    { id: 2, reviewerName: 'Bob', rating: 4, comment: 'Very good', date: '2025-04-22', productId: 102 },
    { id: 3, reviewerName: 'Charlie', rating: 3, comment: 'Average', date: '2025-04-23', productId: 101 },
  ];

  constructor() {}

  getReviewsByProductId(productId: number): Observable<Review[]> {
    const filteredReviews = this.reviews.filter(r => r.productId === productId);
    return of(filteredReviews);
  }
}
