package com.ecommerce.backend.entity;

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
    @ManyToOne
@JoinColumn(name = "variant_id", referencedColumnName = "id", nullable = true)
private ProductVariant variant;
@Enumerated(EnumType.STRING)
private OrderItemStatus itemStatus = OrderItemStatus.ACTIVE;

public OrderItemStatus getItemStatus() {
    return itemStatus;
}
public void setItemStatus(OrderItemStatus itemStatus) {
    this.itemStatus = itemStatus;
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
}