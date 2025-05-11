// src/app/modules/admin/order-mgmt/order-mgmt.component.ts

import { Component, OnInit } from '@angular/core';
import { OrderService, OrderResponse, OrderItemResponse as BaseOrderItem } from '@core/services/order.service';

interface AdminOrderItem extends BaseOrderItem {
  status: string;
  variantId?: number;
  shipmentStatus?: string;
  // Hem varyant görsellerini hem de productImage fallback’ını barındıracak:
  imageUrls: string[];
}

interface GroupedOrder {
  id: number;
  userName: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: AdminOrderItem[];
}

@Component({
  selector: 'app-order-mgmt',
  templateUrl: './order-mgmt.component.html',
  styleUrls: ['./order-mgmt.component.css'],
  standalone: false
})
export class OrderMgmtComponent implements OnInit {
  orders: GroupedOrder[] = [];
  filteredOrders: GroupedOrder[] = [];
  selectedStatus = 'ALL';

  statuses: string[] = [
    'ALL', 'PLACED', 'PROCESSING', 'SHIPPED',
    'DELIVERED', 'CANCELLED', 'REFUNDED'
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: (rawOrders: OrderResponse[]) => {
        this.orders = rawOrders.map(o => ({
          id: o.id,
          userName: o.user?.name ?? '—',
          totalAmount: o.totalAmount ?? 0,
          status: o.status ?? '—',
          createdAt: o.createdAt ?? '',
          items: (o.items as BaseOrderItem[]).map(item => {
            // 1) Eğer varyantId varsa ve backend imageUrls array döndüyse:
            const variantImgs = (item as any).imageUrls as string[] | undefined;
            const firstVariantImg =
              (item.variantId && Array.isArray(variantImgs) && variantImgs.length > 0)
                ? variantImgs[0]
                : undefined;

            // 2) Fallback olarak tekil productImage:
            const fallbackImg = item.productImage ? item.productImage : '';

            // 3) Son olarak imageUrls dizisini oluştur:
            const imgs = firstVariantImg
              ? [ firstVariantImg ]
              : fallbackImg
                ? [ fallbackImg ]
                : [];

            return {
              ...item,
              status: (item as any).status ?? '—',
              variantId: item.variantId,
              shipmentStatus: (item as any).shipmentStatus,
              imageUrls: imgs
            } as AdminOrderItem;
          })
        }));
        this.filteredOrders = [...this.orders];
      },
      error: err => console.error('Siparişler yüklenirken hata:', err)
    });
  }

  filterByStatus(): void {
    this.filteredOrders = this.selectedStatus === 'ALL'
      ? [...this.orders]
      : this.orders.filter(o => o.status === this.selectedStatus);
  }

  fullImageUrl(path: string): string {
    return path.startsWith('http')
      ? path
      : `http://localhost:8081${path}`;
  }
}
