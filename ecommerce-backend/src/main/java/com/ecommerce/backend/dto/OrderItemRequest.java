package com.ecommerce.backend.dto;

public class OrderItemRequest {
    private Long productId;
    private Long variantId; // null olabilir
    private int quantity;

    public Long getProductId() {
        return productId;
    }
    public Long getVariantId() {
        return variantId;
    }

    public int getQuantity() {
        return quantity;
    }
}