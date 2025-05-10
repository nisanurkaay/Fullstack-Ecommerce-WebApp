// src/app/modules/product/review-list/review-list.component.ts

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Review } from '../../../core/models/review.model';
import { AuthService } from '../../../core/services/auth.service';
import { ReviewService, ReviewResponse } from '../../../core/services/review.service';
import { OrderService } from '../../../core/services/order.service';
import { take, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrl: './review-list.component.css',
  standalone: false
})
export class ReviewListComponent implements OnChanges {
  @Input() reviews: Review[] = [];
  @Input() productId!: number;    // artık dışarıdan alıyoruz

  sortedReviews: Review[] = [];
  displayCount = 4;
  selectedSort: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';
  showForm = false;

  newReview: Partial<Review> = {
    reviewerName: '',
    rating: 0,
    comment: ''
  };

  hasOrdered = false;
  private currentOrderId?: number;

  constructor(
    private auth: AuthService,
    private reviewService: ReviewService,
    private orderService: OrderService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reviews']) {
      this.applySort();
    }
  }

  private applySort() {
    const arr = [...this.reviews];
    switch (this.selectedSort) {
      case 'newest':
        arr.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        arr.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest':
        arr.sort((a, b) => a.rating - b.rating);
        break;
    }
    this.sortedReviews = arr;
    this.displayCount = Math.min(4, arr.length);
  }

  onSortChange() {
    this.applySort();
  }

  get canLoadMore(): boolean {
    return this.displayCount < this.sortedReviews.length;
  }

  loadMore() {
    this.displayCount = Math.min(this.displayCount + 4, this.sortedReviews.length);
  }

  toggleForm() {
    if (this.showForm) {
      return this.closeForm();
    }

    // 1) kimlik bilgisi al → 2) siparişleri getir → 3) bu ürünü içeriyor mu kontrol et
    this.auth.getCurrentUser().pipe(
      take(1),
      switchMap(user => this.orderService.getMyOrders().pipe(take(1)))
    ).subscribe(orders => {
      const order = orders.find(o =>
        o.items.some((it: any) => it.productId === this.productId)
      );
      if (order) {
        this.hasOrdered = true;
        this.currentOrderId = order.id;
        this.openForm();
      } else {
        alert('Bu ürünü satın almadan yorum yapamazsınız.');
      }
    }, () => {
      alert('Yorum yapabilmek için giriş yapmalısınız.');
    });
  }

  private openForm() {
    this.showForm = true;
    // kullanıcı adını doldur
    this.auth.getCurrentUser().pipe(take(1)).subscribe(user => {
      this.newReview.reviewerName = user.name;
    });
  }

  private closeForm() {
    this.showForm = false;
    this.newReview = { reviewerName: '', rating: 0, comment: '' };
  }

  submitReview() {
    if (!this.newReview.comment || this.newReview.rating! <= 0) {
      return alert('Lütfen tüm alanları doldurun ve puan verin.');
    }
    if (!this.currentOrderId) {
      return alert('Sipariş bilgisi bulunamadı.');
    }

    const payload = {
      productId: this.productId,
      rating: this.newReview.rating!,
      comment: this.newReview.comment!,
      orderId: this.currentOrderId!
    };

    this.reviewService.createReview(payload).pipe(take(1)).subscribe({
      next: (res: ReviewResponse) => {
        // backend’den gelen yanıta göre yeni yorumu ekle
        const added: Review = {
          id: res.id,
          productId: res.productId,
          reviewerName: res.reviewerName,
          rating: res.rating,
          comment: res.comment,
          date: res.reviewDate
        };
        this.reviews = [added, ...this.reviews];
        this.applySort();
        this.closeForm();
      },
      error: err => alert('Yorum gönderilirken hata: ' + err.message)
    });
  }
}
