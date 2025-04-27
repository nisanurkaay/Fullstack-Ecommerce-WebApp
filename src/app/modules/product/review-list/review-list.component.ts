// src/app/modules/product/review-list/review-list.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Review } from '../../../core/models/review.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  standalone:false
})
export class ReviewListComponent implements OnChanges {
  @Input() reviews: Review[] = [];

  constructor(private auth: AuthService) {}

  // Sıralanmış yorumlar
  sortedReviews: Review[] = [];

  // Kaçını göstereceğiz
  displayCount = 4;

  // Seçili sıralama
  selectedSort: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';

  // Form göster/gizle
  showForm = false;

  // Yeni yorum verisi
  newReview: Partial<Review> = {
    reviewerName: '',
    rating: 0,
    comment: ''
    // productId ve date, ProductDetailComponent tarafından atanabilir
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reviews']) {
      this.applySort();
    }
  }

  // Sıralama ve slice uygulama
  private applySort() {
    const arr = [...this.reviews];
    switch (this.selectedSort) {
      case 'newest':
        arr.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        arr.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        arr.sort((a,b) => b.rating - a.rating);
        break;
      case 'lowest':
        arr.sort((a,b) => a.rating - b.rating);
        break;
    }
    this.sortedReviews = arr;
    // displayCount sınırını güncelle
    this.displayCount = Math.min(this.displayCount, this.sortedReviews.length);
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
    this.showForm = !this.showForm;
    if (this.showForm) {
      // localStorage’daki user objesini alıyoruz
      const user = this.auth.getCurrentUser();
      this.newReview.reviewerName = user?.name || '';
    } else {
      this.newReview = { reviewerName: '', rating: 0, comment: '' };
    }
  }

  submitReview() {
    if (!this.newReview.reviewerName || !this.newReview.comment || !(this.newReview.rating! > 0)) {
      alert('Lütfen tüm alanları doldurun ve puan verin.');
      return;
    }
    const review: Review = {
      id: Date.now(),
      productId: 0,               // ProductDetailComponent içinde set et
      reviewerName: this.newReview.reviewerName!,
      rating: this.newReview.rating!,
      comment: this.newReview.comment!,
      date: new Date().toISOString()
    };
    // Yeni yorumu başa ekle
    this.reviews = [review, ...this.reviews];
    this.applySort();
    this.toggleForm();
  }
}
