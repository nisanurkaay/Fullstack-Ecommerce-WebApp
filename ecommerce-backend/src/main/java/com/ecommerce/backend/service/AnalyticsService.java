package com.ecommerce.backend.service;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.dto.TopSellerDto;
import com.ecommerce.backend.repository.*;;
@Service
public class AnalyticsService {
    private final ProductVariantRepository variantRepo;
    private final OrderItemRepository itemRepo;
    private final ProductRepository productRepo;

    @Autowired
    public AnalyticsService(ProductVariantRepository variantRepo,
                            OrderItemRepository itemRepo,
                            ProductRepository productRepo) {
        this.variantRepo = variantRepo;
        this.itemRepo = itemRepo;
        this.productRepo = productRepo;
    }

    // 5) Low Stock Count
    public long getLowStockCountAdmin(int threshold) {
        return variantRepo.countByStockLessThan(threshold);
    }
    public long getLowStockCountSeller(Long sellerId, int threshold) {
        return variantRepo.countLowStockBySeller(threshold, sellerId);
    }

    // 6) Return Rate
    public double getReturnRateAdmin() {
        long placed = itemRepo.countPlacedItems();
        long refunded = itemRepo.countRefundedItems();
        return placed == 0 ? 0 : (double) refunded / placed * 100;
    }
    public double getReturnRateSeller(Long sellerId) {
        long placed = itemRepo.countPlacedBySeller(sellerId);
        long refunded = itemRepo.countRefundedBySeller(sellerId);
        return placed == 0 ? 0 : (double) refunded / placed * 100;
    }

     public List<Map<String,Object>> getTopCategoriesAdmin(int topN) {
        return productRepo.findCategorySales(PageRequest.of(0, topN))
              .stream()
              .map(arr -> Map.of(
                  "category", arr[0],
                  "sold",     ((Number)arr[1]).longValue()
              ))
              .toList();
    }

    // Seller: sadece kendi ürünlerinin kategorilerindeki satışları getir
    public List<Map<String,Object>> getTopCategoriesSeller(Long sellerId, int topN) {
        return productRepo.findCategorySalesBySeller(
                   sellerId, PageRequest.of(0, topN))
              .stream()
              .map(arr -> Map.of(
                  "category", arr[0],
                  "sold",     ((Number)arr[1]).longValue()
              ))
              .toList();
    }
    
    
    public List<TopSellerDto> getTopSellersAdmin(int topN) {
        return itemRepo.findSellerRevenue(PageRequest.of(0, topN))
            .stream()
            .map(arr -> {
                Long sellerId = ((Number)arr[0]).longValue();
                Double revenue = ((Number)arr[1]).doubleValue();
                return new TopSellerDto(sellerId, null, revenue);
            })
            .toList();
    }

}
