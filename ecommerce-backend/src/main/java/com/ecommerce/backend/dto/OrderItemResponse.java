package com.ecommerce.backend.dto;

public class OrderItemResponse {
    private Long productId;
    private String productName;
    private String productImage;
    private double price;
    private int quantity;
    private Long id;
    private Long variantId;
    private String status;
    public Long getVariantId() {
        return variantId;
    }
    
    public void setVariantId(Long variantId) {
        this.variantId = variantId;
    }
    
   public Long getId() {
       return id;
   }
   public void setId(Long id) {
       this.id = id;
   }

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
public String getStatus() {
    return status;
}
public void setStatus(String status) {
    this.status = status;
}
    public void setProductName(String productName) {
        this.productName = productName;
    }
    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
    
}
