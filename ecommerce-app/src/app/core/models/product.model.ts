export type ProductStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'BANNED';
export type Color = 'RED' | 'BLUE' | 'GREEN' | 'BLACK' | 'WHITE' | 'YELLOW' | 'GRAY' | 'PINK' | 'PURPLE' | 'ORANGE';

export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  categoryId: number;
  productStatus?: ProductStatus;
  categoryName?: string;
  sellerName?: string;
  imageUrls?: string[];
  variants?: ProductVariant[];
  color?: string;
}

export interface ProductVariant {
  id?: number;
  color: string;
  size: string;
  stock: number;
  price: number;

  imageUrls: string[]; // çoklu görsel URL'leri
}
