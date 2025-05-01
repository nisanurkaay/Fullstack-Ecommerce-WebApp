package com.ecommerce.backend.dto;

import java.util.List;


public class OrderDTO {
    private List<Long> productIds;
    private List<Integer> quantities;

    public List<Long> getProductIds() {
        return productIds;
    }

    public List<Integer> getQuantities() {
        return quantities;
    }
    public void setProductIds(List<Long> productIds) {
        this.productIds = productIds;
    }

    public void setQuantities(List<Integer> quantities) {
        this.quantities = quantities;
    }
}