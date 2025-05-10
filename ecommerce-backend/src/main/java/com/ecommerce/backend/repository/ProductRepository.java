package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByProductStatus(ProductStatus status);    
    List<Product> findBySellerId(Long sellerId); // Satıcıya göre ürünleri bulmak için
    @Query("SELECT p FROM Product p LEFT JOIN p.variants v WHERE " +
       "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
       "(:colors IS NULL OR p.color IN :colors OR v.color IN :colors) AND " +
       "(:sizes IS NULL OR v.size IN :sizes)")
List<Product> findAllWithFilters(@Param("categoryId") Long categoryId,
                                 @Param("colors") List<String> colors,
                                 @Param("sizes") List<String> sizes);



                                    // Admin için kategori satışları
    @Query("""
      SELECT p.category.name, SUM(i.quantity)
      FROM OrderItem i
      JOIN i.product p
      GROUP BY p.category.name
      ORDER BY SUM(i.quantity) DESC
    """)
    List<Object[]> findCategorySales(Pageable pageable);

    // Seller için kategori satışları
    @Query("""
      SELECT p.category.name, SUM(i.quantity)
      FROM OrderItem i
      JOIN i.product p
      WHERE i.seller.id = :sellerId
      GROUP BY p.category.name
      ORDER BY SUM(i.quantity) DESC
    """)
    List<Object[]> findCategorySalesBySeller(@Param("sellerId") Long sellerId,
                                             Pageable pageable);

}
