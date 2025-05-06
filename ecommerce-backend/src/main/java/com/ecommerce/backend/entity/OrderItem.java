package com.ecommerce.backend.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;


@Entity
@Table(name = "order_items")

public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonIgnore // Bunu eklemen çok önemli!
    private Order order;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OrderItemStatus status;
    
    @ManyToOne
@JoinColumn(name = "variant_id") // Eğer bu adla bir sütun yoksa, değiştirebilirsin
private ProductVariant variant;


private String trackingNumber;
@Enumerated(EnumType.STRING)
private ShipmentStatus shipmentStatus;
private LocalDate estimatedDeliveryDate;

@ManyToOne
private User seller;

public void setSeller(User seller) {
    this.seller = seller;
}

public User getSeller() {
    return seller;
}

public OrderItemStatus getStatus() {
        return status;
    }

    public void setStatus(OrderItemStatus status) {
        this.status = status;
    }
    public ProductVariant getVariant() {
        return variant;
    }
    public void setVariant(ProductVariant variant) {
        this.variant = variant;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public Product getProduct() {
        return product;
    }public int getQuantity() {
        return quantity;
    }
    public void setOrder(Order order) {
        this.order = order;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public LocalDate getEstimatedDeliveryDate() {
        return estimatedDeliveryDate;
    }
    public ShipmentStatus getShipmentStatus() {
        return shipmentStatus;
    }
    public String getTrackingNumber() {
        return trackingNumber;
    }
    public void setEstimatedDeliveryDate(LocalDate estimatedDeliveryDate) {
        this.estimatedDeliveryDate = estimatedDeliveryDate;
    }
    public void setShipmentStatus(ShipmentStatus shipmentStatus) {
        this.shipmentStatus = shipmentStatus;
    }
    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }
}