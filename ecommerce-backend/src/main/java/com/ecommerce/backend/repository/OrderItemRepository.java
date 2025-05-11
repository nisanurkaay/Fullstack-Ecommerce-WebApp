package com.ecommerce.backend.repository;
import com.ecommerce.backend.entity.OrderItem;
import com.ecommerce.backend.entity.ShipmentStatus;

import java.util.List;

import org.springframework.data.domain.Pageable;    
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
    // Seller: tüm iade dışındaki satış miktarları
@Query("""
  SELECT COUNT(i)
  FROM OrderItem i
  WHERE i.seller.id = :sellerId
""")
 long countPlacedBySeller(@Param("sellerId") Long sellerId);

    @Query("""
      SELECT COUNT(i)
      FROM OrderItem i
      WHERE i.status = 'CANCELLED'
        AND i.seller.id = :sellerId
    """)
    long countRefundedBySeller(@Param("sellerId") Long sellerId);


      @Query("""
      SELECT i.seller.id AS sellerId,
             SUM(
               CASE WHEN i.variant IS NOT NULL
                    THEN i.variant.price * i.quantity
                    ELSE i.product.price * i.quantity
               END
             ) AS revenue
      FROM OrderItem i
      GROUP BY i.seller.id
      ORDER BY SUM(
        CASE WHEN i.variant IS NOT NULL
             THEN i.variant.price * i.quantity
             ELSE i.product.price * i.quantity
        END
      ) DESC
    """)
    List<Object[]> findSellerRevenue(Pageable pageable);
       @Query("""
      SELECT i
      FROM OrderItem i
      WHERE i.shipmentStatus IS NOT NULL
        AND i.shipmentStatus <> com.ecommerce.backend.entity.ShipmentStatus.CANCELLED
    """)
    List<OrderItem> findAllActiveShipments();
}