import { Component, OnInit } from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { HttpClient } from '@angular/common/http';

interface OrderItemResponse {
  id:         number;
  productId:  number;
  productName:string;
  productImage:string;
  price:      number;
  quantity:   number;
  status:     string;
    shipmentStatus?: string;
  variantId?: number;
}

interface OrderResponse {
  id:             number;
  totalAmount:    number;
  status:         string;
  createdAt:      string;  // or Date
  paymentIntentId:string;
  items:          OrderItemResponse[];
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone:false
})
export class MyOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  statusOptions = ['PLACED','SHIPPED','DELIVERED','CANCELLED'];

  constructor(
    private orderService: OrderService,
    private http:        HttpClient
  ) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: orders => this.orders = orders,
      error: err    => console.error('Order fetch error:', err)
    });
  }

  cancelItem(orderId: number, itemId: number): void {
    this.orderService.cancelItemBySeller(orderId, itemId).subscribe({
      next: ()  => this.getOrders(),
      error: e  => console.error('Cancel item error', e)
    });
  }

  updateItemStatus(orderId: number, itemId: number, newStatus: string): void {
    this.orderService.updateItemStatus(orderId, itemId, newStatus).subscribe({
      next: ()  => this.getOrders(),
      error: e  => {
        console.error('Status update error', e);
        alert(e.error?.message || 'Durum güncellenemedi.');
      }
    });
  }

  refundOrder(paymentIntentId: string): void {
    if (!paymentIntentId?.startsWith('pi_')) {
      return alert('Hatalı PaymentIntent ID');
    }
    this.http.post(
      `${this.orderService['apiUrl']}/refund`,
      null,
      { params: { paymentIntentId } }
    ).subscribe({
      next: () => {
        alert('İade başarılı!');
        this.getOrders();
      },
      error: e => alert('İade hatası: ' + e.error?.message)
    });
  }
}
