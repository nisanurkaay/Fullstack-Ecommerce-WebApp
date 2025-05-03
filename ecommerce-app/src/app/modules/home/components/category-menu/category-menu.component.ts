import { Component, OnInit } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import { Category } from '@core/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.css'],
  standalone: false
})
export class CategoryMenuComponent implements OnInit {
  categories: Category[] = [];
  expandedId: number | null = null;
  show: boolean = false;

  constructor(private categoryService: CategoryService, private router: Router) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(data => {
      this.categories = data;
    });
  }

  getMainCategories(): Category[] {
    return this.categories.filter(c => !c.parentId);
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(c => c.parentId === parentId);
  }

  toggleExpand(id: number): void {
    this.expandedId = this.expandedId === id ? null : id;
  }

  navigateToCategory(id: number): void {
    this.router.navigate(['/products'], { queryParams: { category: id } });
  }
}
