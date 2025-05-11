import { Component, OnInit } from '@angular/core';
import { LogisticsService, ShipmentItem } from '@core/services/logistics.service';

@Component({
  selector: 'app-logistics-dashboard',
  templateUrl: './logistics-dashboard.component.html',
  styleUrl: './logistics-dashboard.component.css',
  standalone:false
})

export class LogisticsDashboardComponent implements OnInit {
  shipments: ShipmentItem[] = [];

  statusOptions = [
    'TRANSIT',
    'AT_DISTRIBUTION_CENTER',
    'AT_BRANCH',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  NEXT_STATUS: Record<string, string> = {
    TRANSIT:                 'AT_DISTRIBUTION_CENTER',
    AT_DISTRIBUTION_CENTER:  'AT_BRANCH',
    AT_BRANCH:               'SHIPPED',
    SHIPPED:                 'DELIVERED'
    // DELIVERED ve CANCELLED için artık buton yok
  };
  constructor(private logistics: LogisticsService) {}

  ngOnInit(): void {
    this.loadShipments();
  }

  private loadShipments(): void {
    this.logistics.getAllShipments().subscribe({
      next: data => this.shipments = data,
      error: err => console.error('Yükleme hatası', err)
    });
  }

  onStatusChange(item: ShipmentItem, newStatus: string) {
    this.logistics.updateShipmentStatus(item.id, newStatus).subscribe({
      next: () => this.loadShipments(),
      error: e => alert(e.error?.message || 'Durum güncellenemedi')
    });
  }
  advance(item: ShipmentItem) {
    const next = this.NEXT_STATUS[item.shipmentStatus!];
    if (!next) return;
    this.logistics.updateShipmentStatus(item.id, next).subscribe({
      next: () => this.loadShipments(),
      error: e => alert(e.error?.message || 'Durum güncellenemedi')
    });
  }
}
