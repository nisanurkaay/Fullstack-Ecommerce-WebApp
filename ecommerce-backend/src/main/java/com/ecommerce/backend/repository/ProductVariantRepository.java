package com.ecommerce.backend.repository;
import com.ecommerce.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {}

