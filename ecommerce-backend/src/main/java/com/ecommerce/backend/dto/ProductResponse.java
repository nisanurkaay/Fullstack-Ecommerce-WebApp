package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.entity.ProductVariant;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


import com.ecommerce.backend.entity.ColorEnum;
import com.ecommerce.backend.entity.Product;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String categoryName;
    private Long categoryId; 
    private String sellerName;
    private ProductStatus productStatus;
    private List<String> imageUrls;
    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }
    
    private List<ProductVariantResponse> variants = new ArrayList<>();


public List<ProductVariantResponse> getVariants() {
    return variants;
}

public void setVariants(List<ProductVariantResponse> variants) {
    this.variants = variants;
}
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

  
public Long getCategoryId() {
    return categoryId;
}
public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
}
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
    public String getCategoryName() {
        return categoryName;
    }
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    public String getSellerName() {
        return sellerName;
    }
    public void setSellerName(String sellerName) {
        this.sellerName = sellerName;
    }

    public ProductStatus getProductStatus() {
        return productStatus;
    }
    public void setProductStatus(ProductStatus productStatus) {
        this.productStatus = productStatus;
    }

    private ColorEnum color;

public ColorEnum getColor() {
    return color;
}
public void setColor(ColorEnum color) {
    this.color = color;
}
public static ProductResponse fromEntity(Product product) {
    ProductResponse response = new ProductResponse();
    response.setId(product.getId());
    response.setName(product.getName());
    response.setDescription(product.getDescription());
    response.setCategoryId(product.getCategory().getId());
    response.setImageUrls(product.getImageUrls());
    response.setColor(product.getColor());
    response.setPrice(product.getPrice());
    response.setStockQuantity(product.getStockQuantity());
    response.setProductStatus(product.getProductStatus());

    if (product.getVariants() != null) {
        response.setVariants(
            product.getVariants().stream()
                   .map(ProductVariantResponse::fromEntity) // varsa
                   .collect(Collectors.toList())
        );
    }

    return response;
}

}