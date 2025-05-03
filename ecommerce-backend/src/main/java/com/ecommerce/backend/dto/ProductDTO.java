package com.ecommerce.backend.dto;

import java.util.List;

public class ProductDTO {
    private String name;
    private String description;
    private double price;
    private int stock;
    private List<String> imageUrls; // ✅ birden fazla görsel desteği

    // Getter & Setter
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
    private String color;

public String getColor() {
    return color;
}
public void setColor(String color) {
    this.color = color;
}

}
