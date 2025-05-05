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

    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }
}