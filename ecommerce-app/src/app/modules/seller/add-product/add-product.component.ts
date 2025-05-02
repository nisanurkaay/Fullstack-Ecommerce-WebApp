import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductStatus} from '../../../core/models/product.model';

@Component({
  selector: 'app-addproduct',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      stockQuantity: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    console.log('sellerId from storage:', localStorage.getItem('userId'));
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  onSubmit(): void {
    const product: Product = this.form.value;
    const sellerId = Number(localStorage.getItem('userId')); // doğru ID geliyor mu?

    this.productService.create(product, sellerId).subscribe({
      next: () => {
        alert('Product submitted');
        this.form.reset();
      },
      error: (err) => console.error('Product create error:', err)
    });
  }
}

