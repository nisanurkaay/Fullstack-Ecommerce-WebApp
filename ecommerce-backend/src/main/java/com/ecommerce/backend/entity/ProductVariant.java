package com.ecommerce.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;;
@Entity
public class ProductVariant {
    @Id @GeneratedValue
    private Long id;

    private ColorEnum color;
    @Column(name = "size")
    private String size;
    
    private Integer stock;
    private Double price;

    @Column(name = "image_urls")
    @ElementCollection
    private List<String> imageUrls;// Çoklu görsel desteği

   @ManyToOne
@JoinColumn(name = "product_id")
@JsonIgnore // ✅ Bu olmazsa sonsuz döngüye girer
private Product product;
@Enumerated(EnumType.STRING)
private ProductStatus productStatus;
    public ProductStatus getProductStatus() {
        return productStatus;
    }
    public void setProductStatus(ProductStatus productStatus) {
        this.productStatus = productStatus;
    }
    public ColorEnum getColor() {
        return color;
    }
    public void setColor(ColorEnum color) {
        this.color = color;
    }

    public Long getId() {
        return id;
    }
    public List<String> getImageUrls() {
        return imageUrls;
    }
    public Double getPrice() {
        return price;
    }
    public Product getProduct() {
        return product;
    }
    public String getSize() {
        return size;
    }

    public Integer getStock() {
        return stock;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public void setProduct(Product product) {
        this.product = product;
    }
    public void setSize(String size) {
        this.size = size;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }

    @Column(name = "amount_sold")
private int amountSold = 0;

@Column(name = "total_revenue")
private double totalRevenue = 0.0;

@Column(name = "last_sold_at")
private LocalDateTime lastSoldAt;


public int getAmountSold() {
    return amountSold;



}


public double getTotalRevenue() {
    return totalRevenue;


}


public void setTotalRevenue(double totalRevenue) {
    this.totalRevenue = totalRevenue;


}
public LocalDateTime getLastSoldAt() {
    return lastSoldAt;


}

public void setLastSoldAt(LocalDateTime lastSoldAt) {
    this.lastSoldAt = lastSoldAt;


}

public void setAmountSold(int amountSold) {
    this.amountSold = amountSold;


}


}