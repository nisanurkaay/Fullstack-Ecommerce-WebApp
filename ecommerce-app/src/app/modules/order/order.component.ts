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
    filteredOrders: GroupedOrder[] = [];
  currentFilter: 'ACTIVE' | 'COMPLETED' | 'CANCELLED' = 'ACTIVE';
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

      this.applyFilter();

    });
  }

  setFilter(filter: 'ACTIVE'|'COMPLETED'|'CANCELLED') {
    this.currentFilter = filter;
    this.applyFilter();
  }

  private applyFilter() {
    this.filteredOrders = this.orders.filter(o => {
      switch (this.currentFilter) {
        case 'ACTIVE':
          return o.status !== 'DELIVERED' && o.status !== 'CANCELLED';
        case 'COMPLETED':
          return o.status === 'DELIVERED';
        case 'CANCELLED':
          return o.status === 'CANCELLED';
      }
    });
  }

ngOnInit(): void {
  this.load();
}
  cancel(orderId: number) {
    if (!confirm('Bu siparişi gerçekten iptal etmek istiyor musunuz?')) return;
    this.orderService.cancelOrderAsCustomer(orderId).subscribe({
      next: msg => {
        alert(msg);
        this.load();
      },
      error: err => alert('İptal sırasında hata: ' + err.message)
    });
  }

}
