package com.ecommerce.backend.repository;
import com.ecommerce.backend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

       // Admin: toplam satılan ve iade edilen miktar
    @Query("SELECT COUNT(i) FROM OrderItem i WHERE i.status = 'PLACED'")
    long countPlacedItems();

    @Query("SELECT COUNT(i) FROM OrderItem i WHERE i.status = 'REFUNDED'")
    long countRefundedItems();

    // Seller: kendi iade ve satış miktarları
    @Query("""
      SELECT COUNT(i)
      FROM OrderItem i
      WHERE i.status = 'PLACED'
        AND i.seller.id = :sellerId
    """)
    long countPlacedBySeller(@Param("sellerId") Long sellerId);

    @Query("""
      SELECT COUNT(i)
      FROM OrderItem i
      WHERE i.status = 'REFUNDED'
        AND i.seller.id = :sellerId
    """)
    long countRefundedBySeller(@Param("sellerId") Long sellerId);
}