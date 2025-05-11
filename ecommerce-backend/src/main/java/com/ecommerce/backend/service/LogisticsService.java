package com.ecommerce.backend.service;

import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderItemStatus;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.entity.ShipmentStatus;
import com.ecommerce.backend.repository.OrderItemRepository;
import com.ecommerce.backend.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LogisticsService {

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private OrderRepository orderRepository;

    /**
     * Lojistikçi dashboard için henüz tam sevkiyata geçmemiş
     * (shipmentStatus != null) tüm sipariş kalemlerini getir.
     */
    public List<OrderItem> getAllShipments() {
        return orderItemRepo.findAllActiveShipments();
    }

    /**
     * Tek bir sipariş kaleminin kargo durumunu günceller.
     * Eğer yeni durum DELIVERED veya CANCELLED ise OrderItem.status
     * alanını da ona uyacak şekilde set eder. Ardından eğer parent
     * Order içindeki tüm kalemler DELIVERED olmuşsa Order.status’u da
     * DELIVERED’a yükseltir.
     */
    @Transactional
    public OrderItem updateShipmentStatus(Long itemId, ShipmentStatus newStatus) {
        OrderItem item = orderItemRepo.findById(itemId)
            .orElseThrow(() -> new EntityNotFoundException("OrderItem bulunamadı: " + itemId));

        ShipmentStatus current = item.getShipmentStatus();

        boolean validTransition =
              (current == ShipmentStatus.TRANSIT
                && newStatus == ShipmentStatus.AT_DISTRIBUTION_CENTER)
           || (current == ShipmentStatus.AT_DISTRIBUTION_CENTER
                && newStatus == ShipmentStatus.AT_BRANCH)
           || (current == ShipmentStatus.AT_BRANCH
                && newStatus == ShipmentStatus.SHIPPED)
           || (current == ShipmentStatus.SHIPPED
                && newStatus == ShipmentStatus.DELIVERED)
           || (newStatus == ShipmentStatus.CANCELLED);

        if (!validTransition) {
            throw new IllegalStateException(
              "Geçersiz durum geçişi: " + current + " → " + newStatus
            );
        }

        // 1) Shipment durumunu set et
        item.setShipmentStatus(newStatus);

        // 2) Eğer final aşama ise sipariş kalemi status’unu da güncelle
        if (newStatus == ShipmentStatus.DELIVERED) {
            item.setStatus(OrderItemStatus.DELIVERED);
        } else if (newStatus == ShipmentStatus.CANCELLED) {
            item.setStatus(OrderItemStatus.CANCELLED);
        }

        // 3) Kaydet
        OrderItem savedItem = orderItemRepo.save(item);

        // 4) Parent Order'ı kontrol et ve gerekiyorsa güncelle
        Order order = savedItem.getOrder();
        boolean allDelivered = order.getItems().stream()
            .allMatch(i -> i.getShipmentStatus() == ShipmentStatus.DELIVERED);

        if (allDelivered) {
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
        }

        return savedItem;
    }
}
