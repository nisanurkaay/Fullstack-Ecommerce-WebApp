import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductVariant } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
  standalone: false
})
export class EditProductComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  productId!: number;
  hasVariants = false;
  sameForAll = false;
  colors: string[] = ['RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE', 'YELLOW', 'GRAY', 'PINK', 'PURPLE', 'ORANGE'];

  variants: ProductVariant[] = [];
  existingMainImages: string[] = [];
  variantImages: string[][] = [];
  newMainImages: File[] = [];
  newVariantImages: File[][] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      categoryId: [null, Validators.required],
      price: [0],
      stockQuantity: [0],
      color: ['']
    });
  }

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.categoryService.getAll().subscribe(data => this.categories = data);
    this.productService.getById(this.productId).subscribe(product => {
      this.form.patchValue({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        stockQuantity: product.stockQuantity,
        color : product.color
      });

      this.hasVariants = !!(product.variants && product.variants.length > 0);

      this.variants = product.variants || [];
      this.existingMainImages = product.imageUrls || [];
      this.variantImages = this.variants.map(v => v.imageUrls || []);
    });
  }

  onNewMainImagesSelected(event: any): void {
    const files = Array.from(event.target.files);
    this.newMainImages = files as File[];
  }

  onNewVariantImagesSelected(event: any, index: number): void {
    const files = Array.from(event.target.files);
    this.newVariantImages[index] = files as File[];
  }

  onSubmit(): void {
    const updatedProduct = {
      ...this.form.value,
      categoryId: Number(this.form.value.categoryId),
      color: this.form.value.color,
      variants: this.variants
    };

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify(updatedProduct)], { type: 'application/json' }));

    const allNewImages = this.hasVariants ? this.newVariantImages.flat() : this.newMainImages;
    allNewImages.forEach(file => formData.append('files', file));

    const sellerId = Number(localStorage.getItem('userId'));
    this.productService.updateRaw(this.productId, formData, sellerId).subscribe({
      next: () => {
        alert('Ürün başarıyla güncellendi!');
        this.router.navigate(['/seller/my-products']);
      },
      error: err => {
        console.error('Update error:', err);
      }
    });
  }
}

