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
      next: (products: Product[]) => {
        this.bestSellers = products.slice(0, 10); // örnek
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching best sellers:', err);
        this.isLoading = false;
      }
    });

  }
}
