import { Component, OnInit } from '@angular/core';
import { OrderService } from '@core/services/order.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone: false
})
export class MyOrdersComponent implements OnInit {
  orders: any[] = [];
  selectedStatus: string = '';

  constructor(private orderService: OrderService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
      },
      error: (err) => {
        console.error('Order fetch error:', err);
      }
    });
  }
  getSelectValue(event: Event): string {
    return (event.target as HTMLSelectElement).value;
  }

  cancelItem(orderId: number, itemId: number) {
    this.orderService.cancelItemBySeller(orderId, itemId).subscribe({
      next: () => this.fetchOrders(),
      error: err => console.error(err)
    });
  }

  updateItemStatus(orderId: number, itemId: number, newStatus: string) {
    this.orderService.updateItemStatus(orderId, itemId, newStatus).subscribe({
      next: () => this.fetchOrders(),
      error: err => console.error(err)
    });
  }

  statusOptions = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
}
