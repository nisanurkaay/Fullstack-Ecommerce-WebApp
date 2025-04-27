import { Product } from './product.model'; // Eğer ileride gerekirse

export interface Review {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
  productId: number;   // Şimdilik sadece bu yeterli
  // product?: Product; // İlerde gerekirse açarsın
}
