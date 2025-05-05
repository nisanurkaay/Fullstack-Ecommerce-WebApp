import { Component,OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-order-mgmt',
  standalone: false,
  templateUrl: './order-mgmt.component.html',
  styleUrl: './order-mgmt.component.css'

})
export class OrderMgmtComponent implements OnInit {
  allOrders: Order[] = [];
  filteredOrders: Order[] = [];
  selectedStatus: string = 'ALL';

  statuses: string[] = ['ALL', 'PLACED', 'PROCESSING', 'SHIPPED', 'CANCELLED', 'REFUNDED'];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe(data => {
      this.allOrders = data;
      this.filteredOrders = data;
    });
  }

  filterByStatus() {
    if (this.selectedStatus === 'ALL') {
      this.filteredOrders = this.allOrders;
    } else {
      this.filteredOrders = this.allOrders.filter(order => order.status === this.selectedStatus);
    }
  }
}
