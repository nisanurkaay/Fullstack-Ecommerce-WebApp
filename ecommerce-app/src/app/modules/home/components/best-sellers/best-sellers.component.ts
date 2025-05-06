import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { Product } from '../../../../core/models/product.model';


@Component({
  selector: 'app-best-sellers',
  standalone:false,
  templateUrl: './best-sellers.component.html',
  styleUrls: ['./best-sellers.component.css']
})
export class BestSellersComponent implements OnInit {
  bestSellers: Product[] = [];
  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.bestSellers = products.slice(0, 5); // sadece ilk 5 ürün
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching best sellers', err);
        this.isLoading = false;
      }
    });
  }
}
