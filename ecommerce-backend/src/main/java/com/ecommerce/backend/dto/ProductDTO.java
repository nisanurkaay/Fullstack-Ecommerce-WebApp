package com.ecommerce.backend.dto;

public class ProductDTO {
    private String name;
    private String description;
    private double price;
    private int stock;
    private String imageUrl;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public String getDescription() {
        return description;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setPrice(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }
    
    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getStock() {
        return stock;
    }

}