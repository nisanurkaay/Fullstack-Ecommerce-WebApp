package com.ecommerce.backend.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private String name;
    private String description;
    private double price;
    private int stock;
    private String imageUrl;
}