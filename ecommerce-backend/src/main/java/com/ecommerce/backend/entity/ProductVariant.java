package com.ecommerce.backend.entity;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;;
@Entity
public class ProductVariant {
    @Id @GeneratedValue
    private Long id;

    private String color;
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

    public String getColor() {
        return color;
    }
    public void setColor(String color) {
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
}
