import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
  standalone: false
})
export class MyOrdersComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'ALL';
  statuses: string[] = ['ALL', 'ACTIVE', 'CANCELLED'];
  currentSellerId: number = 0;

  constructor(private orderService: OrderService, private authService: AuthService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(data => {
      this.allOrders = data;
      this.filteredOrders = data;
    });

    this.authService.getCurrentUser().subscribe(user => {
      this.currentSellerId = user.id ?? 0;
    });
  }

  filterByStatus() {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.allOrders;
    } else {
      this.filteredOrders = this.allOrders.filter(order =>
        order.items.some(item =>
          item.itemStatus === this.selectedStatus &&
          item.product.sellerId === this.currentSellerId
        )
      );
    }
  }


}
