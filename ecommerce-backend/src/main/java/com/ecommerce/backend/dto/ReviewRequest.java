package com.ecommerce.backend.dto;

public class ReviewRequest {
    private Long productId;
    private int rating;
    private String comment;
    private Long orderId;

    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getComment() {
        return comment;
    }

    public Long getProductId() {
        return productId;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }
    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}

