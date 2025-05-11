import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ShipmentItem {
  id:             number;
  orderId:        number;
  productId:      number;
  productName:    string;
  productImage:   string;
  quantity:       number;
  shipmentStatus: string;
}

@Injectable({ providedIn: 'root' })
export class LogisticsService {
  private baseUrl = `${environment.apiUrl}/logistics`;

  constructor(private http: HttpClient) {}

  /** Lojistikçi dashboard için tüm kargo öğelerini getir */
  getAllShipments(): Observable<ShipmentItem[]> {
    return this.http.get<ShipmentItem[]>(`${this.baseUrl}/order-items`);
  }

  /** Belirli bir kargo öğesinin durumunu güncelle */
  updateShipmentStatus(itemId: number, newStatus: string): Observable<ShipmentItem> {
    return this.http.patch<ShipmentItem>(
      `${this.baseUrl}/order-items/${itemId}/shipment-status`,
      { newStatus }
    );
  }
}
