package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.ProductVariantRequest;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.ecommerce.backend.service.FileStorageService; // Import the FileStorageService class

import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService; // Assuming you have a file storage service

    public ProductController(ProductService productService,
                             FileStorageService fileStorageService) {   
        this.productService = productService;
        this.fileStorageService = fileStorageService; // Initialize your file storage service here
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> createProduct(

        @RequestPart("product") String productJson,
        @RequestPart("files") MultipartFile[] files,
        @RequestParam Long sellerId
    ) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ProductRequest request = mapper.readValue(productJson, ProductRequest.class);
    
            List<String> urls = Arrays.stream(files)
                                      .map(fileStorageService::saveFile)
                                      .toList();
    
            if (request.getVariants() == null || request.getVariants().isEmpty()) {
                // ✅ Ana ürüne 3 görsel ata
                request.setImageUrls(urls); // urls zaten 3 adet olmalı
            } else {
                int perVariant = 3;
                List<ProductVariantRequest> variants = request.getVariants();
                for (int i = 0; i < variants.size(); i++) {
                    int start = i * perVariant;
                    int end = Math.min(start + perVariant, urls.size());
                    List<String> variantUrls = urls.subList(start, end);
                    variants.get(i).setImageUrls(variantUrls);
                }
            }
    
            return ResponseEntity.ok(productService.createProduct(request, sellerId));
        } catch (Exception e) {


            e.printStackTrace(); // log hatayı
            return ResponseEntity.badRequest().build();
        }

    }
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.approveProduct(id));
    }
    

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
                                                         @RequestBody ProductRequest request,
                                                         @RequestParam Long userId) {
        return ResponseEntity.ok(productService.updateProduct(id, request, userId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
                                              @RequestParam Long userId) {
        productService.deleteProduct(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> activateProduct(@PathVariable Long id,
                                                           @RequestParam Long userId) {
        return ResponseEntity.ok(productService.activateProduct(id, userId));
    }

    @DeleteMapping("/admin-ban/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminBanProduct(@PathVariable Long id) {
        productService.adminBanProduct(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getAllPendingProducts() {
        return ResponseEntity.ok(productService.getAllPendingProducts());
    }
    @GetMapping("/my")
@PreAuthorize("hasRole('SELLER')")
public ResponseEntity<List<ProductResponse>> getMyProducts(@RequestParam Long sellerId) {
    return ResponseEntity.ok(productService.getProductsBySeller(sellerId));
}

@PutMapping("/{id}/deny")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<ProductResponse> denyProduct(@PathVariable Long id) {
    return ResponseEntity.ok(productService.denyProduct(id));
}
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllActiveProducts() {
        return ResponseEntity.ok(productService.getAllActiveProducts());
    }
    @PutMapping(value = "/{id}/add-variant", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@PreAuthorize("hasRole('SELLER')")
public ResponseEntity<ProductResponse> addVariant(
    @PathVariable Long id,
    @RequestPart("variant") String variantJson,
    @RequestPart("files") MultipartFile[] files
) {
    try {
        ObjectMapper mapper = new ObjectMapper();
        ProductVariantRequest variant = mapper.readValue(variantJson, ProductVariantRequest.class);

        List<String> urls = Arrays.stream(files)
                                  .map(fileStorageService::saveFile)
                                  .toList();
        variant.setImageUrls(urls);

        return ResponseEntity.ok(productService.addVariantToProduct(id, variant));
    } catch (Exception e) {
        return ResponseEntity.badRequest().build();
    }
}
@PutMapping("/{id}/add-variant")
@PreAuthorize("hasRole('SELLER')")
public ResponseEntity<ProductResponse> addVariantToProduct(
    @PathVariable Long id,
    @RequestBody ProductVariantRequest variantRequest
) {
    return ResponseEntity.ok(productService.addVariantToProduct(id, variantRequest));
}

}
