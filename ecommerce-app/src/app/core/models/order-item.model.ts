import { Product } from './product.model';

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;

}
