package com.ecommerce.backend.entity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import javax.imageio.plugins.tiff.GeoTIFFTagSet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

 @ManyToOne
@JoinColumn(name = "seller_id")
@JsonIgnore // s// veya sadece "products"
private User seller;
    @ManyToOne
    @JoinColumn(name = "category_id") // Category ID
    private Category category;

    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;


    @Column(nullable = false)
    private int amountSold = 0;

    
    @Column(name="color")
    @Enumerated(EnumType.STRING)
    private ColorEnum color;


    public ColorEnum getColor() {
        return color;
    }
 
public int getAmountSold() {
    return amountSold;
}
public void setAmountSold(int amountSold) {
    this.amountSold = amountSold;
}
private LocalDateTime lastSoldAt;

public LocalDateTime getLastSoldAt() {
    return lastSoldAt;
}
public void setLastSoldAt(LocalDateTime lastSoldAt) {
    this.lastSoldAt = lastSoldAt;
}
@Column(name = "total_revenue")
private double totalRevenue = 0.0;

public double getTotalRevenue() {
    return totalRevenue;
}
public void setTotalRevenue(double totalRevenue) {
    this.totalRevenue = totalRevenue;
}

@OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
@JsonIgnore // Review'lar ayrı endpoint’ten çağrılacağı için
private List<Review> reviews;


public List<Review> getReviews() {
    return reviews;
}
public void setReviews(List<Review> reviews) {
    this.reviews = reviews;
}


@Column(name = "view_count")
private int viewCount = 0;

public int getViewCount() {
    return viewCount;
}
public void setViewCount(int viewCount) {
    this.viewCount = viewCount;
}

    public void setColor(ColorEnum  color) {
        this.color = color;
    }
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls;

    public List<String> getImageUrls() {
        return imageUrls;
    }
    
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductVariant> variants = new ArrayList<>();
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

    public List<ProductVariant> getVariants() {
        return variants;
    }
    public void setVariants(List<ProductVariant> variants) {
        this.variants = variants;
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
    @Column(name = "review_count")
private int reviewCount = 0;

@Column(name = "rating_average")
private double ratingAverage = 0.0;

public double getRatingAverage() {
    return ratingAverage;
}
public void setRatingAverage(double ratingAverage) {
    this.ratingAverage = ratingAverage;
}

public int getReviewCount() {
    return reviewCount;
}
public void setReviewCount(int reviewCount) {
    this.reviewCount = reviewCount;
}
}