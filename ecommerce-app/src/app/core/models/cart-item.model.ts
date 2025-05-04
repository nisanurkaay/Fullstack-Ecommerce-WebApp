// src/app/core/models/cart-item.model.ts
import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;

}
