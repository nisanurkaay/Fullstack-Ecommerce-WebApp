// ✅ variant-selector-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, ProductVariant } from '../../../core/models/product.model';

@Component({
  selector: 'app-variant-selector-dialog',
  templateUrl: './variant-selector-dialog.component.html',
  standalone:false,
  styleUrls: ['./variant-selector-dialog.component.css']
})
export class VariantSelectorDialogComponent {
  selectedColor: string = '';
  selectedSize: string = '';
  matchedVariant?: ProductVariant;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product: Product },
    private dialogRef: MatDialogRef<VariantSelectorDialogComponent>
  ) {}

  get availableColors(): string[] {
    return [...new Set(this.data.product.variants?.map(v => v.color))];
  }

  get availableSizesWithStock(): { size: string; disabled: boolean }[] {
    if (!this.selectedColor) return [];

    const variantsForColor = this.data.product.variants?.filter(
      v => v.color.toLowerCase() === this.selectedColor.toLowerCase()
    );

    const allSizes = [...new Set(this.data.product.variants?.map(v => v.size))];

    return allSizes.map(size => ({
      size,
      disabled: !variantsForColor?.some(v => v.size === size && v.stock > 0)
    }));
  }

  updateMatchedVariant(): void {
    if (!this.selectedColor || !this.selectedSize) {
      this.matchedVariant = undefined;
      return;
    }

    this.matchedVariant = this.data.product.variants?.find(
      v =>
        v.color.toLowerCase() === this.selectedColor.toLowerCase() &&
        v.size.toLowerCase() === this.selectedSize.toLowerCase()
    );
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    this.updateMatchedVariant();
  }

  confirm(): void {
    if (this.matchedVariant) {
      this.dialogRef.close(this.matchedVariant);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
  selectColor(color: string): void {
    this.selectedColor = color;
    this.updateMatchedVariant();
  }



  isSizeAvailable(size: string): boolean {
    return this.data.product.variants?.some(
      v => v.color === this.selectedColor && v.size === size
    ) ?? false;
  }

  get allSizes(): string[] {
    return [...new Set(this.data.product.variants?.map(v => v.size))];
  }

}
