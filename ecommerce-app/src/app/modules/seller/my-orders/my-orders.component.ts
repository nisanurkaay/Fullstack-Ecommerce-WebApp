import { Component, OnInit} from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
@Component({
  selector: 'app-my-orders',
  standalone: false,
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {

  allMyOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'ALL';
  statuses: string[] = ['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'CANCELLED', 'REFUNDED'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(data => {
      this.allMyOrders = data;
      this.filteredOrders = data;
    });
  }

  filterByStatus() {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.allMyOrders;
    } else {
      this.filteredOrders = this.allMyOrders.filter(order => order.status === this.selectedStatus);
    }
  }

  cancelOrder(orderId: number) {
    this.orderService.cancelOrderBySeller(orderId).subscribe(response => {
      // Handle the response after cancelling the order
      console.log('Order cancelled:', response);
      // Optionally, refresh the order list or update the UI
      this.ngOnInit(); // Refresh the order list
    }, error => {
      console.error('Error cancelling order:', error);
    });
  }


}
