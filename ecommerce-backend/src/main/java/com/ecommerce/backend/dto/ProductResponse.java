package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.ProductStatus;
import lombok.Data;

@Data
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private String categoryName;
    private String sellerName;
    private ProductStatus productStatus;

    // Getter - Setter
}
