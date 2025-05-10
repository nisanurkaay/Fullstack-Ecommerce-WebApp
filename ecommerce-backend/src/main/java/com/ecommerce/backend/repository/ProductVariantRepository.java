package com.ecommerce.backend.repository;
import com.ecommerce.backend.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> 
{


        long countByStockLessThan(int threshold);

    // Seller: sadece kendi ürünlerinin varyantlarında
    @Query("""
      SELECT COUNT(v)
      FROM ProductVariant v
      WHERE v.stock < :threshold
        AND v.product.seller.id = :sellerId
    """)
    long countLowStockBySeller(@Param("threshold") int threshold,
                               @Param("sellerId") Long sellerId);
}

