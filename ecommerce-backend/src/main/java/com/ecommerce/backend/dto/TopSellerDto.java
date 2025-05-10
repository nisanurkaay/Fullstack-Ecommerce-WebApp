// src/main/java/com/ecommerce/backend/dto/TopSellerDto.java
package com.ecommerce.backend.dto;

public record TopSellerDto(
    Long sellerId,
    String sellerName,
    Double revenue
) {}
