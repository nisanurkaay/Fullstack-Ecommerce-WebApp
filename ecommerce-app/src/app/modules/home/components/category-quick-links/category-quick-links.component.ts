import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-category-quick-links',
  standalone: false,
  templateUrl: './category-quick-links.component.html',
  styleUrl: './category-quick-links.component.css'
})

export class CategoryQuickLinksComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
      this.categoryService.getAll().subscribe({
        next: (cats: Category[]) => this.categories = cats,
        error: (err: any) => console.error('Error loading categories', err)
      });
    }
  }

