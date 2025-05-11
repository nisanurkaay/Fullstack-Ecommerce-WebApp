package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProductIdAndVariantId(User user, Long productId, Long variantId);
    void deleteByUserAndProductIdAndVariantId(User user, Long productId, Long variantId);
    void deleteByUser(User user);
}
