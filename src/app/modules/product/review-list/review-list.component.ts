// src/app/modules/product/review-list/review-list.component.ts
import { Component, Input } from '@angular/core';
import { Review } from '../../../core/models/review.model';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
  standalone:false
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];

  // Seçili sıralama
  selectedSort: 'newest' | 'oldest' | 'highest' | 'lowest' = 'newest';

  // İlk başta kaç adet gösterilsin
  displayCount = 4;

  /** Sıralama değiştiğinde çalışır */
  onSortChange() {
    const arr = [...this.reviews];
    switch (this.selectedSort) {
      case 'newest':
        this.reviews = arr.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case 'oldest':
        this.reviews = arr.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'highest':
        this.reviews = arr.sort((a,b) => b.rating - a.rating);
        break;
      case 'lowest':
        this.reviews = arr.sort((a,b) => a.rating - b.rating);
        break;
    }
  }

  /** Daha fazla yorum yükle */
  loadMore() {
    this.displayCount = Math.min(this.displayCount + 4, this.reviews.length);
  }
}
