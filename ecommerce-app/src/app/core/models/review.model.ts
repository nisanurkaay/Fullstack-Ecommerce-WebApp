export interface Review {
  id: number;
  productId: number;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;       // reviewDate to string
  orderId?: number;   // isteğe bağlı
}
