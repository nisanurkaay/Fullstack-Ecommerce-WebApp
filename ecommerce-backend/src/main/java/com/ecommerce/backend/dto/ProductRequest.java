package com.ecommerce.backend.dto;
import java.util.List;

import com.ecommerce.backend.entity.ColorEnum;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private Long categoryId;
    private List<ProductVariantRequest> variants;
 
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
    public Integer getStockQuantity() {
        return stockQuantity;
    }
    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
    public Long getCategoryId() {
        return categoryId;
    }
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    public void setVariants(List<ProductVariantRequest> variants) {
        this.variants = variants;
    }
    public List<ProductVariantRequest> getVariants() {
        return variants;
    } 

    private List<String> imageUrls;
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }


  
    private ColorEnum color;

public ColorEnum getColor() {
    return color;
}
public void setColor(ColorEnum color) {
    this.color = color;
}
} 