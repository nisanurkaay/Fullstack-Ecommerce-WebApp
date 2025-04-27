import { Component, Input } from '@angular/core';
import { Review } from '../../../core/models/review.model';
@Component({
  selector: 'app-review-list',
  standalone: false,
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css']
})
export class ReviewListComponent {
  @Input() reviews: Review[] = [];
}
