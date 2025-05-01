// src/app/modules/product/review-list/review-list.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Review } from '../../../core/models/review.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  standalone: false
})
export class ReviewListComponent implements OnChanges {
  @Input() reviews: Review[] = [];

  constructor(private auth: AuthService) {}

  sortedReviews: Review[] = [];
  displayCount = 4;
  selectedSort: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';
  showForm = false;

  newReview: Partial<Review> = {
    reviewerName: '',
    rating: 0,
    comment: ''
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['reviews']) this.applySort();
  }

  private applySort() {
    const arr = [...this.reviews];
    switch (this.selectedSort) {
      case 'newest': arr.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case 'oldest': arr.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break;
      case 'highest': arr.sort((a,b) => b.rating - a.rating); break;
      case 'lowest': arr.sort((a,b) => a.rating - b.rating); break;
    }
    this.sortedReviews = arr;
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
      this.auth.getCurrentUser().subscribe({
        next: user => {
          this.newReview.reviewerName = user.name;
        },
        error: () => {
          alert('Yorum yapabilmek için giriş yapmalısınız.');
          this.showForm = false;
        }
      });
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
      productId: 0, // dışarıdan atanmalı
      reviewerName: this.newReview.reviewerName!,
      rating: this.newReview.rating!,
      comment: this.newReview.comment!,
      date: new Date().toISOString()
    };

    this.reviews = [review, ...this.reviews];
    this.applySort();
    this.toggleForm();
  }
}
