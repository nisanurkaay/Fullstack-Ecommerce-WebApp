import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  standalone:false
})
export class OrderComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Siparişler yüklenirken hata oluştu.';
        this.loading = false;
      }
    });
  }
}
