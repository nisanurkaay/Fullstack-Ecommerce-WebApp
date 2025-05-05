package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ReviewRequest;
import com.ecommerce.backend.dto.ReviewResponse;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.Review;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ecommerce.backend.entity.Order; // ✅ Satın alma kontrolü için ekledik
import com.ecommerce.backend.repository.OrderRepository; // ✅ Satın alma kontrolü için ekledik

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired private ProductRepository productRepository;
    @Autowired private ReviewRepository reviewRepository;
    @Autowired private OrderRepository orderRepository; // ✅ Satın alma kontrolü için ekledik

   public Review addReview(ReviewRequest request, User user) {
    Product product = productRepository.findById(request.getProductId())
        .orElseThrow(() -> new RuntimeException("Product not found"));

    Order order = orderRepository.findById(request.getOrderId())
        .orElseThrow(() -> new RuntimeException("Order not found"));

    Review review = new Review();
    review.setProduct(product);
    review.setOrder(order); // ✅
    review.setUser(user);
    review.setRating(request.getRating());
    review.setComment(request.getComment());
    review.setCreatedAt(LocalDateTime.now());

    reviewRepository.save(review);

    // reviewCount ve ratingAverage güncelle
    List<Review> allReviews = reviewRepository.findByProduct(product);
    int totalReviews = allReviews.size();
    double avgRating = allReviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

    product.setReviewCount(totalReviews);
    product.setRatingAverage(avgRating);
    productRepository.save(product);

    return review;
}

public List<ReviewResponse> getReviewsByProductId(Long productId) {
    return reviewRepository.findByProductId(productId).stream()
        .map(ReviewResponse::new)
        .collect(Collectors.toList());
}
       
}
