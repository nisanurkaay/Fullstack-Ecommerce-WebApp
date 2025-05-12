import { User } from './user.model';
import { OrderItem } from './order-item.model';

export interface Order {
  id: number;
  user: User;
  createdAt: string;
  totalAmount: number;
  status: 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'CANCELLED' | 'REFUNDED';
  items: OrderItem[];
  paymentIntentId?: string;
}
