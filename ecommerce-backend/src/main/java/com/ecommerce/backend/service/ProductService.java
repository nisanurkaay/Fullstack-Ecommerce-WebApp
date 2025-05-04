package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.ProductVariantRequest;
import com.ecommerce.backend.entity.ProductStatus;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request, Long sellerId);

    ProductResponse updateProduct(Long id, ProductRequest request, Long userId);

    void deleteProduct(Long id, Long userId);
    List<ProductResponse> getProductsBySeller(Long sellerId) ;
ProductResponse addVariantToProduct(Long productId, ProductVariantRequest variant);
void hardDelete(Long id, Long userId);
void deleteVariant(Long productId, Long variantId);
    void adminBanProduct(Long id);
    List<ProductResponse> filterProductsByRole(Long categoryId, List<String> colors, List<String> sizes, Long userId);

    List<ProductResponse> getAllPendingProducts();
    ProductResponse getProductById(Long id);
     ProductResponse approveProduct(Long id);
    List<ProductResponse> getAllActiveProducts();
    ProductResponse activateProduct(Long id, Long userId);
    ProductResponse denyProduct(Long id);
    List<ProductResponse> getProductsByStatus(ProductStatus status);
    public List<ProductResponse> filterProducts(Long categoryId, List<String> colors, List<String> sizes);

}
