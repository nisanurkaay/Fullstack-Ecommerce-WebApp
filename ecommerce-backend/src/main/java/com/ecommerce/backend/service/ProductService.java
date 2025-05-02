package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request, Long sellerId);

    ProductResponse updateProduct(Long id, ProductRequest request, Long userId);

    void deleteProduct(Long id, Long userId);

    void adminBanProduct(Long id);

    ProductResponse getProductById(Long id);
     ProductResponse approveProduct(Long id);
    List<ProductResponse> getAllActiveProducts();
    ProductResponse activateProduct(Long id, Long userId);
}
