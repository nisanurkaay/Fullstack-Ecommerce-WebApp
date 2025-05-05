package com.ecommerce.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private double totalAmount;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
    private String userName;


    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public List<OrderItemResponse> getItems() {
        return items;
    }
    public String getStatus() {
        return status;
    }
    public double getTotalAmount() {
        return totalAmount;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    public void setItems(List<OrderItemResponse> items) {
        this.items = items;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    
}
