package com.ecommerce.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import com.ecommerce.backend.service.ProductVariantService;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.repository.ProductVariantRepository;

public class ProductVariantController {

        @Autowired
    private ProductVariantRepository repository;
    @Autowired
    private ProductVariantService productVariantService;

    @PutMapping("/variants/{variantId}/activate")
public ResponseEntity<?> activateVariant(@PathVariable Long variantId) {
    productVariantService.activate(variantId);
    return ResponseEntity.ok().build();
}

@PutMapping("/variants/{variantId}/deactivate")
public ResponseEntity<?> deactivateVariant(@PathVariable Long variantId) {
    productVariantService.deactivate(variantId);
    return ResponseEntity.ok().build();
}

    @PutMapping("/products/variants/{id}/approve-variant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> approveProduct(@PathVariable Long id) {
        productVariantService.approveVariant(id);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/products/variants/{id}/deny-variant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> denyProduct(@PathVariable Long id) {
        productVariantService.denyProduct(id);
        return ResponseEntity.ok().build();
    }

}
