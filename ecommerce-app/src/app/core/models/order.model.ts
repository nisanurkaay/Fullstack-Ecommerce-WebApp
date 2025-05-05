import { User } from './user.model';
import { OrderItem } from './order-item.model';

export interface Order {
  id: number;
  user: User;
  createdAt: string; // ISO string
  totalAmount: number;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'CANCELLED' | 'REFUNDED'; // enum karşılığı
  items: OrderItem[];
  paymentIntentId?: string;
}
