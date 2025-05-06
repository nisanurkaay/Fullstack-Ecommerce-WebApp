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
  refund(paymentIntentId: string) {
    if (!paymentIntentId.startsWith('pi_')) {
      alert('Hatalı PaymentIntent ID');
      return;
    }

    this.http.post('http://localhost:8081/api/payments/refund', null, {
      params: { paymentIntentId }
    }).subscribe({
      next: () => alert('İade başarılı!'),
      error: err => alert('İade hatası: ' + err.error.message)
    });
  }
  refundItem(paymentIntentId: string) {
    if (!paymentIntentId.startsWith('pi_')) {
      alert('Hatalı PaymentIntent ID!');
      return;
    }

    this.http.post('http://localhost:8081/api/payments/refund', null, {
      params: { paymentIntentId }
    }).subscribe({
      next: () => {
        alert('İade işlemi başarılı!');
        this.fetchOrders(); // isteğe bağlı: UI'ı yenilemek için
      },
      error: err => {
        console.error(err);
        alert('İade işlemi başarısız: ' + err.error.message);
      }
    });
  }
  refundOrder(paymentIntentId: string) {
    const cleanId = paymentIntentId.split('_secret_')[0];
    this.http.post('http://localhost:8081/api/payments/refund', null, {
      params: { paymentIntentId }
    }).subscribe({
      next: () => {
        alert('Sipariş başarıyla iade edildi');
        this.fetchOrders(); // opsiyonel: sipariş listesini yenile
      },
      error: err => {
        console.error(err);
        alert('İade işlemi başarısız: ' + err.error.message);
      }
    });
  }

  updateItemStatus(orderId: number, itemId: number, newStatus: string) {
    this.orderService.updateItemStatus(orderId, itemId, newStatus).subscribe({
      next: () => {
        // refresh or reload orders
        this.fetchOrders();
      },
      error: err => {
        console.error('Statü güncelleme hatası:', err);
        alert(err.error?.message || 'Durum güncellenemedi.');
      }
    });
  }


  statusOptions = ['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
}
