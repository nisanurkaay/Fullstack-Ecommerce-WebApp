package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.ShipmentStatus;
import com.ecommerce.backend.service.LogisticsService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logistics")
public class LogisticsController {

    @Autowired
    private LogisticsService logisticsService;

    // artık path: /api/logistics/order-items/{id}/shipment-status
    @PatchMapping("/order-items/{id}/shipment-status")
    @PreAuthorize("hasRole('LOGISTICS')")
    public ResponseEntity<OrderItem> updateShipmentStatus(
            @PathVariable Long id,
            @RequestBody ShipmentUpdateRequest req) {
        OrderItem updated = logisticsService.updateShipmentStatus(id, req.getNewStatus());
        return ResponseEntity.ok(updated);
    }

    // basit DTO
    public static class ShipmentUpdateRequest {
        private ShipmentStatus newStatus;
        public ShipmentStatus getNewStatus() { return newStatus; }
        public void setNewStatus(ShipmentStatus newStatus) { this.newStatus = newStatus; }
    }


        @GetMapping("/order-items")
    @PreAuthorize("hasRole('LOGISTICS')")
    public ResponseEntity<List<ShipmentDto>> getAllShipments() {
        List<ShipmentDto> dtos = logisticsService.getAllShipments().stream()
            .map(item -> {
                ShipmentDto d = new ShipmentDto();
                d.setId(item.getId());
                d.setOrderId(item.getOrder().getId());
                d.setProductId(item.getProduct().getId());
                d.setProductName(item.getProduct().getName());
                d.setProductImage(item.getProduct().getImageUrls().stream().findFirst().orElse(""));
                d.setQuantity(item.getQuantity());
                d.setShipmentStatus(item.getShipmentStatus().name());
                return d;
            }).toList();
        return ResponseEntity.ok(dtos);
    }
    public static class ShipmentDto {
        private Long id, orderId, productId;
        private String productName, productImage;
        private Integer quantity;
        private String shipmentStatus;
       public Long getId() {
           return id;
       }
       public Long getOrderId() {
           return orderId;
       }
       public Long getProductId() {
           return productId;
       }
       public String getProductImage() {
           return productImage;
       }
       public String getProductName() {
           return productName;
       }

       public Integer getQuantity() {
           return quantity;
       }
       public String getShipmentStatus() {
           return shipmentStatus;
       }
       public void setId(Long id) {
           this.id = id;
       }
       public void setOrderId(Long orderId) {
           this.orderId = orderId;
       }

       public void setProductId(Long productId) {
           this.productId = productId;
       }
       public void setProductImage(String productImage) {
           this.productImage = productImage;
       }
       public void setProductName(String productName) {
           this.productName = productName;
       }
       public void setQuantity(Integer quantity) {
           this.quantity = quantity;
       }
public void setShipmentStatus(String shipmentStatus) {
    this.shipmentStatus = shipmentStatus;
}
       
    }


}
