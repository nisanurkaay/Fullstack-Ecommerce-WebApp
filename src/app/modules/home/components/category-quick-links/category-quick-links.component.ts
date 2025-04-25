import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-category-quick-links',
  standalone: false,
  templateUrl: './category-quick-links.component.html',
  styleUrl: './category-quick-links.component.css'
})

export class CategoryQuickLinksComponent implements OnInit {
  categories: string[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('Error loading categories', err)
    });
  }
}
