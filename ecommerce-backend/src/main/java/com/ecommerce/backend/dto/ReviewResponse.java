package com.ecommerce.backend.dto;

import java.time.LocalDateTime;

import com.ecommerce.backend.entity.Review;

public class ReviewResponse {
    private String userName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
    private Long orderId;
    private LocalDateTime orderDate;
    private String reviewerName;
    private LocalDateTime reviewDate;
    
    
    public LocalDateTime getReviewDate() {
        return reviewDate;
    }
    public void setReviewDate(LocalDateTime reviewDate) {
        this.reviewDate = reviewDate;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }
    public String getReviewerName() {
        return reviewerName;
    }
    public LocalDateTime getOrderDate() {
        return orderDate;
    }
    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public Long getOrderId() {
        return orderId;
    }
    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }


    public String getComment() {
        return comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public int getRating() {
        return rating;
    }

    public String getUserName() {
        return userName;
    }
public void setComment(String comment) {
    this.comment = comment;
}

public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}
public void setRating(int rating) {
    this.rating = rating;
}

public void setUserName(String userName) {
    this.userName = userName;


}   

public ReviewResponse(Review review) {
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.reviewerName = review.getUser().getName();
        this.reviewDate = review.getCreatedAt();
        
        if (review.getOrder() != null) {
            this.orderId = review.getOrder().getId();
            this.orderDate = review.getOrder().getCreatedAt(); // varsayım
        }
    }
    public ReviewResponse() {
    }
}