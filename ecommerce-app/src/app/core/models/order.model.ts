import { User } from './user.model';
import { OrderItem } from './order-item.model';


export interface Order {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  userName?: string;
}
