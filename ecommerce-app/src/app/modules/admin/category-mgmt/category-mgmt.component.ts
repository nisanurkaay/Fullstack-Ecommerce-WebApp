import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../core/models/category.model';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-category-mgmt',
  templateUrl: './category-mgmt.component.html',
  styleUrls: ['./category-mgmt.component.css'],
  standalone: false
})
export class CategoryMgmtComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  expandedCategoryId: number | null = null;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      isSubCategory: [false],
      parentCategoryId: [null],
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data;
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.form.reset({ isSubCategory: false, parentCategoryId: null });
    }
  }

  onSubmit(): void {
    const newCategory: any = {
      name: this.form.value.name,
      description: this.form.value.description,
      parentCategoryId: this.form.value.isSubCategory ? this.form.value.parentCategoryId : null
    };

    this.categoryService.create(newCategory).subscribe(() => {
      this.loadCategories();
      this.toggleForm();
    });
  }


  toggleSubcategories(categoryId: number): void {
    this.expandedCategoryId = this.expandedCategoryId === categoryId ? null : categoryId;
  }

  getParentCategories(): Category[] {
    return this.categories.filter(c => !c.parentId); // Ana kategoriler
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(c => c.parentId === parentId); // Alt kategoriler
  }

}
