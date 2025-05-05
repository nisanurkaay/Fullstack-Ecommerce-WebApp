package com.ecommerce.backend.repository;


import com.ecommerce.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ecommerce.backend.entity.User;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
@Query("SELECT COUNT(o) FROM Order o JOIN o.items i WHERE o.user = :user AND i.product.id = :productId")
long countOrdersByUserAndProduct(@Param("user") User user, @Param("productId") Long productId);

}