// src/app/modules/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { OrderService, OrderResponse, OrderItemResponse } from '@core/services/order.service';

interface GroupedOrder {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: Date;
  items: OrderItemResponse[];
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone:false
})
export class OrderComponent implements OnInit {
  orders: GroupedOrder[] = [];

  constructor(private orderService: OrderService) {}
 load() {
    this.orderService.getMyOrders().subscribe(raw => {
      this.orders = raw.map(o => ({
        id: o.id,
        totalAmount: o.totalAmount,
        status: o.status,
        createdAt: new Date(o.createdAt),
        items: o.items
      }));
    });
  }

ngOnInit(): void {
  this.orderService.getMyOrders().subscribe((raw: OrderResponse[]) => {
    console.log('▶︎ raw orders:', raw);
    this.orders = raw.map(o => ({
      id: o.id,
      totalAmount: o.totalAmount,
      status: o.status,
      createdAt: new Date(o.createdAt),
      items: o.items
    }));
    console.log('▶︎ mapped orders:', this.orders);
  });
}
  cancel(orderId: number) {
    if (!confirm('Bu siparişi gerçekten iptal etmek istiyor musunuz?')) return;
    this.orderService.cancelOrderAsCustomer(orderId).subscribe({
      next: msg => {
        alert(msg);
        this.load(); // listeyi tazele
      },
      error: err => alert('İptal sırasında hata: ' + err.message)
    });
  }

}
