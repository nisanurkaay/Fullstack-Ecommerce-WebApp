package com.ecommerce.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.entity.ProductVariant;
import com.ecommerce.backend.repository.ProductVariantRepository;

public class ProductVariantService {

        @Autowired
    private ProductVariantRepository repository;

    public void activate(Long id) {
    ProductVariant variant = repository.findById(id).orElseThrow();
    variant.setProductStatus(ProductStatus.ACTIVE);
    repository.save(variant);
}

public void deactivate(Long id) {
    ProductVariant variant = repository.findById(id).orElseThrow();
    variant.setProductStatus(ProductStatus.INACTIVE);
    repository.save(variant);
}

public void denyProduct(Long id) {
    ProductVariant variant = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    if (variant.getProductStatus() != ProductStatus.PENDING) {
        throw new RuntimeException("Only PENDING products can be denied.");
    }

    variant.setProductStatus(ProductStatus.BANNED); // ✅ yayına almıyoruz
    repository.save(variant);
}

public void approveVariant(Long id) {
    ProductVariant variant = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    if (variant.getProductStatus() != ProductStatus.PENDING) {
        throw new RuntimeException("Only PENDING products can be approved.");
    }

    variant.setProductStatus(ProductStatus.INACTIVE); // ✅ yayına almıyoruz
      repository.save(variant);
}

}
