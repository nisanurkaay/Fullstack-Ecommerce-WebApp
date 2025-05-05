package com.ecommerce.backend.dto;

public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String productImage;
    private double price;
    private int quantity;

    public double getPrice() {
        return price;
    }
    public Long getProductId() {
        return productId;
    }
    public String getProductImage() {
        return productImage;
    }
    public String getProductName() {
        return productName;
    }
    public int getQuantity() {
        return quantity;
    }
    public void setPrice(double price) {
        this.price = price;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
}
