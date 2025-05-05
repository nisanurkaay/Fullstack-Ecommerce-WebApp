package com.ecommerce.backend.service;
import com.ecommerce.backend.dto.OrderItemRequest;
import com.ecommerce.backend.dto.OrderItemResponse;
import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.Order;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductVariant;
import com.ecommerce.backend.dto.OrderResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserStatus;
import com.ecommerce.backend.entity.OrderStatus;
import com.ecommerce.backend.repository.OrderRepository;
import jakarta.persistence.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
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
    
    @Transactional
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
                item.setVariant(variant); // ✅ VARIANT’I SET ET!
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
                item.setVariant(null); // ✅ Varyant yoksa null açıkça set edelim
                totalAmount += product.getPrice() * itemRequest.getQuantity();
            }
    
            items.add(item);
        }
    
        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order.setPaymentIntentId(request.getPaymentIntentId()); // ✅ Stripe payment ID
    
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

public void cancelOrderBySeller(Long orderId) {
    Order order = orderRepository.findById(orderId)
        .orElseThrow(() -> new RuntimeException("Order not found"));

    // Order statüsü iptal değilse devam et
    if (order.getStatus() != OrderStatus.CANCELLED) {
        order.setStatus(OrderStatus.CANCELLED);

        // Stoğu geri ekle
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        // Refund işlemi
        stripePaymentService.refundPayment(order.getPaymentIntentId()); // Ödeme ID'si burada tutulmalı

        orderRepository.save(order);
    }
}
public OrderResponse mapToResponse(Order order) {
    OrderResponse response = new OrderResponse();
    response.setId(order.getId());
    response.setTotalAmount(order.getTotalAmount());
    response.setStatus(order.getStatus().toString());
    response.setCreatedAt(order.getCreatedAt());

    List<OrderItemResponse> itemResponses = order.getItems().stream().map(item -> {
        OrderItemResponse itemRes = new OrderItemResponse();
        itemRes.setProductId(item.getProduct().getId());
        itemRes.setProductName(item.getProduct().getName());
        itemRes.setProductImage(
            item.getProduct().getImageUrls() != null && !item.getProduct().getImageUrls().isEmpty()
                ? item.getProduct().getImageUrls().get(0)
                : null
        );
        itemRes.setPrice(item.getProduct().getPrice());
        itemRes.setQuantity(item.getQuantity());
        return itemRes;
    }).toList();

    response.setItems(itemResponses);
    return response;
}

}