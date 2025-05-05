package com.ecommerce.backend.dto;

public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String productImage;
    private int quantity;
    private double price;
    private String color; // 🟡 hem ürün hem varyant için
    private String size;  // 🟡 sadece varyant için (opsiyonel)
    private boolean isVariant;
    
    // Getters & Setters
    public Long getProductId() {
        return productId;
    }
    public void setProductId(Long productId) {
        this.productId = productId;
    }


    public String getColor() {
        return color;
    }


    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }
    public boolean isVariant() {
        return isVariant;
    }



    public void setVariant(boolean isVariant) {
        this.isVariant = isVariant;
    }
    public String getProductName() {
        return productName;
    }
    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImage() {
        return productImage;
    }
    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public int getQuantity() {
        return quantity;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
}
