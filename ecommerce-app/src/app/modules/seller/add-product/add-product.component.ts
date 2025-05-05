import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductVariant } from '../../../core/models/product.model';
import { Router } from '@angular/router';
import { Color } from '../../../core/models/product.model';
@Component({
  selector: 'app-addproduct',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css'],
  standalone: false
})
export class AddProductComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  isSubmitting = false;
  hasVariants = false;
  sameForAll = false;
  sharedPrice = 0;
  sharedStock = 0;
  colorOptions: Color[] = ['RED', 'BLUE', 'GREEN', 'BLACK', 'WHITE', 'YELLOW', 'GRAY', 'PINK', 'PURPLE', 'ORANGE'];
  variants: ProductVariant[] = [];
  variantImages: File[][] = [];
  mainImages: File[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
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
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  addVariant(): void {
    this.variants.push({ color: '', size: '', price: 0, stock: 0, imageUrls: [] });
    this.variantImages.push([]);
  }

  toggleHasVariants(event: Event) {
    this.hasVariants = (event.target as HTMLInputElement).checked;
  }

  toggleSameForAll(event: Event) {
    this.sameForAll = (event.target as HTMLInputElement).checked;
  }

  onMainImagesSelected(event: any): void {
    const files = Array.from(event.target.files);
    if (files.length !== 3) {
      alert("Lütfen tam olarak 3 görsel yükleyin.");
      return;
    }
    this.mainImages = files as File[];
  }

  onVariantImagesSelected(event: any, index: number): void {
    const files = Array.from(event.target.files);
    if (files.length !== 3) {
      alert("Her varyant için tam olarak 3 görsel yüklemelisiniz.");
      return;
    }
    this.variantImages[index] = files as File[];
  }

  onSubmit(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const sellerId = Number(localStorage.getItem('userId'));
    const product = this.form.value;

    // ✅ 3 görsel kontrolü
    if (!this.hasVariants && this.mainImages.length !== 3) {
      alert("Ürüne tam olarak 3 görsel yüklemelisiniz.");
      this.isSubmitting = false;
      return;
    }

    if (this.hasVariants) {
      const invalid = this.variantImages.some(imgs => imgs.length !== 3);
      if (invalid) {
        alert("Her varyant için tam olarak 3 görsel yüklemelisiniz.");
        this.isSubmitting = false;
        return;
      }
    }

    const formData = new FormData();
    formData.append('product', new Blob([JSON.stringify({
      ...product,
      categoryId: Number(product.categoryId),
      color: this.hasVariants ? null : product.color, // ✅ Eklenen satır
      variants: this.hasVariants
  ? this.variants.map((v, i) => ({
      color: v.color, // ✅ burada ENUM olarak göndermek şart
      size: v.size,
      price: this.sameForAll ? this.sharedPrice : v.price,
      stock: this.sameForAll ? this.sharedStock : v.stock,
      imageUrls: [] // server ekleyecek
    }))
  : []

    })], { type: 'application/json' }));

    const allImages = this.hasVariants ? this.variantImages.flat() : this.mainImages;
    allImages.forEach(file => formData.append('files', file));

    this.productService.createRaw(formData, sellerId).subscribe({
      next: () => {
        alert('Ürün başarıyla eklendi');
        this.form.reset();
        this.hasVariants = false;
        this.sameForAll = false;
        this.variants = [];
        this.variantImages = [];
        this.mainImages = [];
        this.router.navigate(['/seller/my-products']);
      },
      error: err => {
        console.error('Product create error:', err);
        this.isSubmitting = false;
      },
      complete: () => this.isSubmitting = false
    });
  }
}
