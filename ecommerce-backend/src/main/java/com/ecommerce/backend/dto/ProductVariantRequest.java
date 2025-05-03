package com.ecommerce.backend.dto;

import org.springframework.web.multipart.MultipartFile;

import java.lang.invoke.MutableCallSite;
import java.util.List;
public class ProductVariantRequest {
    private String color;
    private String size;
    private Integer stock;
    private Double price;
    private List<String> imageUrls; // 👈 Çoklu görsel dosyaları
    

    public String getColor() {
        return color;
    }
    public void setColor(String color) {
        this.color = color;
    }
    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
    public String getSize() {
        return size;
    }
    public void setSize(String size) {
        this.size = size;
    }
    public Integer getStock() {
        return stock;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }
}