export type ProductStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'BANNED';

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
  imageUrl?: string;
}
