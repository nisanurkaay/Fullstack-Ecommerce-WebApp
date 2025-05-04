package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.ProductVariant;

import java.util.List;


public class ProductVariantResponse {

    private Long id;
    private String color;
    private String size;
    private Double price;
    private Integer stock;
    private List<String> imageUrls;

    public static ProductVariantResponse fromEntity(ProductVariant variantEntity) {
        ProductVariantResponse variant = new ProductVariantResponse();
        if (variantEntity.getColor() != null) {
            variant.setColor(variantEntity.getColor().name());
        } else {
            variant.setColor(null); // veya default değer: "UNKNOWN"
        }
        variant.setSize(variantEntity.getSize());
        variant.setStock(variantEntity.getStock());
        variant.setPrice(variantEntity.getPrice());
        variant.setImageUrls(variantEntity.getImageUrls());
        return variant;
    }
    

    public String getColor() {
        return color;
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
    public String getSize() {
        return size;
    }
    public Integer getStock() {
        return stock;
    }

    public void setColor(String color) {
        this.color = color;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }public void setPrice(Double price) {
        this.price = price;
    }
    public void setSize(String size) {
        this.size = size;
    }
    public void setStock(Integer stock) {
        this.stock = stock;
    }
}
