import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
@Component({
  selector: 'app-review-card',
  standalone: false,
  templateUrl: './review-card.component.html',
  styleUrls: ['./review-card.component.css']
})
export class ReviewCardComponent {
  @Input() reviewerName!: string;
  @Input() rating!: number;
  @Input() comment!: string;
  @Input() date!: string;


  @Input() product!: Product;
}
