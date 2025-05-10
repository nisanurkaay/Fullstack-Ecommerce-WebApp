package com.ecommerce.backend.service;
import com.ecommerce.backend.dto.OrderItemRequest;
import com.ecommerce.backend.dto.OrderItemResponse;
import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.OrderItemStatus;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductVariant;
import com.ecommerce.backend.entity.ShipmentStatus;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserStatus;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.repository.OrderRepository;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.Date;
import java.time.Instant;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ProductVariantRepository;
import com.ecommerce.backend.exception.OutOfStockException;
import com.ecommerce.backend.exception.TokenRefreshException;
import com.ecommerce.backend.exception.UserNotActiveException;
import com.ecommerce.backend.service.StripePaymentService;

@Service
public class OrderService {
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductVariantRepository variantRepository;
    @Autowired
    private StripePaymentService stripePaymentService;
    
public Order placeOrder(User user, OrderRequest request) {
    if (!user.getUserStatus().equals(UserStatus.ACTIVE)) {
        throw new UserNotActiveException();
    }

    Order order = new Order();
    order.setUser(user);
    order.setStatus(OrderStatus.PLACED);
    order.setCreatedAt(LocalDateTime.now());

    List<OrderItem> items = new ArrayList<>();
    double totalAmount = 0.0;

    for (OrderItemRequest itemRequest : request.getItems()) {
        OrderItem item = new OrderItem();
        item.setOrder(order);
        item.setQuantity(itemRequest.getQuantity());
        item.setStatus(OrderItemStatus.PLACED); // ✅ Zorunlu alan
        item.setShipmentStatus(ShipmentStatus.PENDING); // opsiyonel ama istersen set et

        if (itemRequest.getVariantId() != null) {
            ProductVariant variant = variantRepository.findById(itemRequest.getVariantId())
                    .orElseThrow(() -> new RuntimeException("Variant not found"));

            if (variant.getStock() < itemRequest.getQuantity()) {
                throw new OutOfStockException("Not enough stock for variant ID " + variant.getId());
            }

            variant.setStock(variant.getStock() - itemRequest.getQuantity());
            variant.setAmountSold(variant.getAmountSold() + itemRequest.getQuantity());
            variant.setTotalRevenue(variant.getTotalRevenue() + variant.getPrice() * itemRequest.getQuantity());
            variant.setLastSoldAt(LocalDateTime.now());
            variantRepository.save(variant);

            Product product = variant.getProduct();
            product.setAmountSold(product.getAmountSold() + itemRequest.getQuantity());
            product.setTotalRevenue(product.getTotalRevenue() + variant.getPrice() * itemRequest.getQuantity());
            product.setLastSoldAt(LocalDateTime.now());
            productRepository.save(product);

            item.setProduct(product);
            item.setVariant(variant);
            item.setSeller(product.getSeller());

            totalAmount += variant.getPrice() * itemRequest.getQuantity();
        } else {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new OutOfStockException("Not enough stock for product ID " + product.getId());
            }

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            product.setAmountSold(product.getAmountSold() + itemRequest.getQuantity());
            product.setTotalRevenue(product.getTotalRevenue() + product.getPrice() * itemRequest.getQuantity());
            product.setLastSoldAt(LocalDateTime.now());
            productRepository.save(product);

            item.setProduct(product);
            item.setVariant(null);
            item.setSeller(product.getSeller());

            totalAmount += product.getPrice() * itemRequest.getQuantity();
        }

        items.add(item);
    }

    order.setItems(items);
    order.setTotalAmount(totalAmount);
    order.setPaymentIntentId(request.getPaymentIntentId()); // ✅ Yalnızca pi_... olmalı

    return orderRepository.save(order);
}

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersForSeller(User seller) {
        List<Order> allOrders = orderRepository.findAll();
        List<Order> filtered = new ArrayList<>();
    
        for (Order order : allOrders) {
            boolean hasSellerProduct = order.getItems().stream()
                .anyMatch(item -> item.getProduct().getSeller().getId().equals(seller.getId()));
    
            if (hasSellerProduct) {
                filtered.add(order);
            }
        }
    
        return filtered;
    }
public OrderResponse mapToSellerResponse(Order order, User seller) {
    OrderResponse resp = new OrderResponse();
    resp.setId(order.getId());
    resp.setCreatedAt(order.getCreatedAt());
    resp.setTotalAmount(order.getTotalAmount());
    resp.setStatus(order.getStatus().name());
    resp.setPaymentIntentId(order.getPaymentIntentId());

    // **only** map the items belonging to this seller:
    List<OrderItemResponse> itemResponses = order.getItems().stream()
        .filter(item -> item.getSeller().getId().equals(seller.getId()))
        .map(item -> {
            OrderItemResponse ir = new OrderItemResponse();
            ir.setId(item.getId());
            ir.setProductId(item.getProduct().getId());
            ir.setProductName(item.getProduct().getName());
            ir.setProductImage(
              item.getProduct().getImageUrls().isEmpty() ? null
                  : item.getProduct().getImageUrls().get(0)
            );
            ir.setQuantity(item.getQuantity());
            ir.setPrice(item.getVariant()!=null
                ? item.getVariant().getPrice()
                : item.getProduct().getPrice()
            );
            ir.setVariantId(item.getVariant()!=null
                ? item.getVariant().getId()
                : null
            );
            ir.setStatus(item.getStatus().name());
            return ir;
        })
        .toList();

    resp.setItems(itemResponses);
    return resp;
}

  @Transactional
public void cancelOrderBySeller(Long orderId, User seller) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    // … stok iadesi, item.setStatus(OrderItemStatus.CANCELLED) gibi işlemler …

    // **Stripe tam iade**  
    String pi = order.getPaymentIntentId();
    if (pi != null && pi.startsWith("pi_")) {
        stripePaymentService.refundPayment(pi);
    }

    order.setStatus(OrderStatus.CANCELLED);
    orderRepository.save(order);
}


public OrderResponse mapToResponse(Order order) {
    OrderResponse response = new OrderResponse();
    response.setId(order.getId());
    response.setTotalAmount(order.getTotalAmount());
    response.setStatus(order.getStatus().toString());
    response.setCreatedAt(order.getCreatedAt());
    response.setPaymentIntentId(order.getPaymentIntentId());

    List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
        OrderItemResponse itemRes = new OrderItemResponse();
        itemRes.setId(item.getId());
        itemRes.setProductId(item.getProduct().getId());
        itemRes.setProductName(item.getProduct().getName());
        itemRes.setProductImage(
            item.getProduct().getImageUrls() != null && !item.getProduct().getImageUrls().isEmpty()
                ? item.getProduct().getImageUrls().get(0)
                : null
        );
        itemRes.setPrice(item.getProduct().getPrice());
        itemRes.setStatus(item.getStatus().toString());
        itemRes.setQuantity(item.getQuantity());
        
        itemRes.setVariantId(item.getVariant() != null ? item.getVariant().getId() : null); // ✅ burası
        
        return itemRes;
    }).toList();

    response.setItems(itemResponses);
    return response;
}@Transactional
public void cancelItemBySeller(Long orderId, Long itemId, User seller) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    OrderItem item = order.getItems().stream()
        .filter(i -> i.getId().equals(itemId)
                  && i.getSeller().getId().equals(seller.getId()))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Item not found or not yours"));

    if (item.getStatus() != OrderItemStatus.CANCELLED) {
        // 1) Stoğu iade et
        if (item.getVariant() != null) {
            ProductVariant v = item.getVariant();
            v.setStock(v.getStock() + item.getQuantity());
            variantRepository.save(v);
        } else {
            Product p = item.getProduct();
            p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
            productRepository.save(p);
        }

        // 2) Refund: tek ürün mü?
        String piFull = order.getPaymentIntentId();
        if (piFull != null && piFull.startsWith("pi_")) {
            boolean singleItemOrder = order.getItems().size() == 1;
            if (singleItemOrder) {
                // tam iade
                stripePaymentService.refundPayment(piFull);
            } else {
                // kısmi iade: bu item tutarı kadar
                double unitPrice = (item.getVariant() != null
                                    ? item.getVariant().getPrice()
                                    : item.getProduct().getPrice());
                long cents = Math.round(unitPrice * item.getQuantity() * 100);
                stripePaymentService.refundPayment(piFull, cents);
            }
        }

        // 3) Kalem statüsünü iptal olarak ata
        item.setStatus(OrderItemStatus.CANCELLED);
    }

    // 4) Eğer tüm kalemler iptal edildiyse, siparişi de CANCELLED yap
    boolean allCancelled = order.getItems().stream()
        .allMatch(i -> i.getStatus() == OrderItemStatus.CANCELLED);
    if (allCancelled) {
        order.setStatus(OrderStatus.CANCELLED);
    }

    orderRepository.save(order);
}
@Transactional
public void updateOrderItemStatus(Long orderId,
                                  Long itemId,
                                  String newStatus,
                                  User seller) {
    // 1) Siparişi al
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    // 2) Sadece bu satıcıya ait item’ı seç
    OrderItem item = order.getItems().stream()
        .filter(i -> i.getId().equals(itemId)
                  && i.getSeller().getId().equals(seller.getId()))
        .findFirst()
        .orElseThrow(() -> new RuntimeException("Item not found or not authorized"));

    // 3) newStatus string’ini enum’a çevir
    OrderItemStatus statusEnum;
    try {
        statusEnum = OrderItemStatus.valueOf(newStatus);
    } catch (IllegalArgumentException e) {
        throw new RuntimeException("Invalid status: " + newStatus);
    }

    // 4) Eğer zaten iade veya iptal edilmişse hata fırlat
    if (item.getStatus() == OrderItemStatus.REFUNDED
     || item.getStatus() == OrderItemStatus.CANCELLED) {
        throw new RuntimeException("Bu ürün zaten iade veya iptal edilmiş.");
    }

    // 5) CANCELLED statüsüne geçiş
    if (statusEnum == OrderItemStatus.CANCELLED) {
        // a) Stoğu geri yükle
        if (item.getVariant() != null) {
            ProductVariant v = item.getVariant();
            v.setStock(v.getStock() + item.getQuantity());
            variantRepository.save(v);
        } else {
            Product p = item.getProduct();
            p.setStockQuantity(p.getStockQuantity() + item.getQuantity());
            productRepository.save(p);
        }

        // b) Refund: tek kalemse full, değilse partial
        String piFull = order.getPaymentIntentId();
        if (piFull != null && piFull.startsWith("pi_")) {
            // tek kalem mi?
            boolean singleItemOrder = order.getItems().size() == 1;

            if (singleItemOrder) {
                // tam iade
                System.out.println("tek iade");
                stripePaymentService.refundPayment(piFull);

            } else {
                // kısmi iade: bu item tutarı kadar
                double unitPrice = item.getVariant() != null
                    ? item.getVariant().getPrice()
                    : item.getProduct().getPrice();
                long cents = Math.round(unitPrice * item.getQuantity() * 100);
                   System.out.println("tek iade");
                stripePaymentService.refundPayment(piFull, cents);
            }
        }

        // c) item statüsünü iptal yap
        item.setStatus(OrderItemStatus.CANCELLED);

    } else {
        // 6) Diğer statülerde sadece güncelle
        item.setStatus(statusEnum);
    }

    // 7) Eğer siparişteki tüm item’lar aynı statüdeyse, order.status’u da eşitle
    boolean allMatch = order.getItems().stream()
        .map(OrderItem::getStatus)
        .allMatch(s -> s == item.getStatus());

    if (allMatch) {
        try {
            order.setStatus(OrderStatus.valueOf(item.getStatus().name()));
        } catch (IllegalArgumentException ignored) { }
    }

    // 8) Kaydet
    orderRepository.save(order);
}

}