import { CoreModule } from './../../../core/core.module';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-mgmt',
  templateUrl: './category-mgmt.component.html',
  standalone:false
})
export class CategoryMgmtComponent implements OnInit {
  categories: Category[] = [];
  showForm = false;
  form: FormGroup;
  expandedCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      isSubCategory: [false],
      parentCategoryId: [null],
      name: ['', Validators.required],
      description: [''],
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
    this.form.reset({ isSubCategory: false });
  }



  onSubmit(): void {
    const newCategory: Category = {
      name: this.form.value.name,
      description: this.form.value.description,
      parentId: this.form.value.isSubCategory
        ? this.form.value.parentCategoryId
        : undefined,
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
    return this.categories.filter(c => !c.parentId);
  }

  getSubcategories(parentId: number): Category[] {
    return this.categories.filter(c => c.parentId === parentId);
  }

}
