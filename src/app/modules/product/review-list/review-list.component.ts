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
}
