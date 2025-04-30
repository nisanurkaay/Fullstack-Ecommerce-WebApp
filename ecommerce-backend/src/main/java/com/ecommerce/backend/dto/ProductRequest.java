package com.ecommerce.backend.dto;
import lombok.Data;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private Double price;
    private Integer stockQuantity;
    private Long categoryId;

}
