package com.ecommerce.backend.dto;

import java.util.List;

public class OrderRequest {
    private List<OrderItemRequest> items;
    private String paymentIntentId;

    public String getPaymentIntentId() {
        return paymentIntentId;
    }
    public void setPaymentIntentId(String paymentIntentId) {
        this.paymentIntentId = paymentIntentId;
    }
    public List<OrderItemRequest> getItems() {
        return items;
    }
    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
}}
