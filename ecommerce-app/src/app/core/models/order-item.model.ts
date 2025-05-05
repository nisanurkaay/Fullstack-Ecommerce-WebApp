import { Product } from './product.model';

export interface OrderItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    sellerId: number; // ✅ Eklenmeli
    imageUrls?: string[];
  };
  productName: string;
  productImage?: string;
  quantity: number;
  price: number;
  itemStatus: 'ACTIVE' | 'CANCELLED'; // ✅ Eksikse ekle
  isVariant?: boolean;
  color?: string;
  size?: string;
}
