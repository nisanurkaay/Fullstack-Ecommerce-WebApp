package com.ecommerce.backend.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "seller_id") // Seller ID
    private User seller;

    @ManyToOne
    @JoinColumn(name = "category_id") // Category ID
    private Category category;

    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.productStatus = ProductStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getter - Setter
}
