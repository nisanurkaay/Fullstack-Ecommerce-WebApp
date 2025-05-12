export interface Review {
  id: number;
  productId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  orderId?: number;
}
