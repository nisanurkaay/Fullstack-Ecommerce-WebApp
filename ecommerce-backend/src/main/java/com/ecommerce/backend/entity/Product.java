package com.ecommerce.backend.entity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

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
    private String imageUrl;

    public String getImageUrl() {
        return imageUrl;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Enumerated(EnumType.STRING)
    private ProductStatus productStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Category getCategory() {
        return category;
    }
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public String getDescription() {
        return description;
    }
    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }
    public Double getPrice() {
        return price;
    }
    public ProductStatus getProductStatus() {
        return productStatus;
    }
    public User getSeller() {
        return seller;
    }
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setCategory(Category category) {
        this.category = category;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public void setProductStatus(ProductStatus productStatus) {
        this.productStatus = productStatus;
    }
    public void setSeller(User seller) {
        this.seller = seller;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
}
