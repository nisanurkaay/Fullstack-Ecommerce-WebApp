export interface CartItemResponse {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variantId?: number;
  variantName?: string;
  quantity: number;
  price: number;
}
