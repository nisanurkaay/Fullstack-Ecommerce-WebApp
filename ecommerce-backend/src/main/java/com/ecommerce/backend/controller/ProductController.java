package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.ProductVariantRequest;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.ecommerce.backend.service.FileStorageService;
import com.ecommerce.backend.service.AnalyticsService;
import com.ecommerce.backend.service.CustomUserDetailsService;// Import the FileStorageService class
       
import com.ecommerce.backend.entity.User;
import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final FileStorageService fileStorageService; // Assuming you have a file storage service
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;
    public ProductController(ProductService productService,
                             FileStorageService fileStorageService,
                             AnalyticsService analyticsService,
                                  UserRepository userRepository
                             ) {   
        this.productService = productService;
        this.fileStorageService = fileStorageService; 
         this.analyticsService = analyticsService; 
         this.userRepository = userRepository;
      
    }

    @PostMapping(path = "", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })

    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> createProduct(
        @RequestPart("product") ProductRequest request,
        @RequestPart("files") MultipartFile[] files,
        @RequestParam Long sellerId
    ) {
        // Dosya sayısı kontrolü
        int expectedImageCount = request.getVariants() == null || request.getVariants().isEmpty()
            ? 3 // Ana ürün
            : request.getVariants().size() * 3;
    
        if (files.length != expectedImageCount) {
            throw new RuntimeException("Görsel sayısı eşleşmiyor. Her varyant için 3 dosya yüklenmeli.");
        }
    
        List<String> allImageUrls = fileStorageService.saveAll(files);
    
        // 🔀 1. Ana ürün görselleri mi?
        if (request.getVariants() == null || request.getVariants().isEmpty()) {
            request.setImageUrls(allImageUrls); // ürünün imageUrls listesine ekle
        } else {
            // 🔀 2. Varyantlara göre dağıt
            List<ProductVariantRequest> variants = request.getVariants();
            for (int i = 0; i < variants.size(); i++) {
                int from = i * 3;
                int to = from + 3;
                List<String> urls = allImageUrls.subList(from, to);
                variants.get(i).setImageUrls(urls);
            }
        }
    
        return ResponseEntity.ok(productService.createProduct(request, sellerId));
    }
    @GetMapping("/colors")
    public ResponseEntity<List<String>> getAllColorsUsedInProducts() {
        return ResponseEntity.ok(productService.getUsedColors());
    }
    

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> approveProduct(@PathVariable Long id) {
        return ResponseEntity.ok(productService.approveProduct(id));
    }
    
    @GetMapping("/filter")
    @PreAuthorize("hasAnyRole('ADMIN', 'SELLER', 'USER')")
    public ResponseEntity<List<ProductResponse>> filterProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) List<String> colors,
            @RequestParam(required = false) List<String> sizes,
            @RequestParam Long userId) {
    
        return ResponseEntity.ok(productService.filterProductsByRole(categoryId, colors, sizes, userId));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')") 
public ResponseEntity<ProductResponse> updateProduct(
    @PathVariable Long id,
    @RequestPart("product") ProductRequest request,
    @RequestPart(name = "files", required = false) MultipartFile[] files,
    @RequestParam Long sellerId
) {
    List<String> imageUrls = new ArrayList<>();
    if (files != null && files.length > 0) {
        imageUrls = fileStorageService.saveAll(files);
    }

    // Varyantlı mı kontrol et
    if (request.getVariants() == null || request.getVariants().isEmpty()) {
        if (!imageUrls.isEmpty()) {
            request.setImageUrls(imageUrls);
        }
    } else {
        for (int i = 0; i < request.getVariants().size(); i++) {
            int from = i * 3;
            int to = from + 3;
            if (imageUrls.size() >= to) {
                request.getVariants().get(i).setImageUrls(imageUrls.subList(from, to));
            }
        }
    }

    return ResponseEntity.ok(productService.updateProduct(id, request, sellerId));
}

@DeleteMapping("/products/{id}")
public ResponseEntity<?> deleteProduct(@PathVariable Long id, @RequestParam Long sellerId) {
    productService.hardDelete(id, sellerId);
    return ResponseEntity.noContent().build();
}
@DeleteMapping("/products/{productId}/variants/{variantId}")
public ResponseEntity<?> deleteVariant(@PathVariable Long productId, @PathVariable Long variantId) {
    productService.deleteVariant(productId, variantId);
    return ResponseEntity.noContent().build();
}


    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> activateProduct(@PathVariable Long id,
                                                           @RequestParam Long userId) {
        return ResponseEntity.ok(productService.activateProduct(id, userId));
    }

    @PutMapping("/{id}/activate-with-variants")
public ResponseEntity<ProductResponse> activateWithVariants(@PathVariable Long id,
                                                             @RequestParam Long userId) {
    return ResponseEntity.ok(productService.activateProductWithVariants(id, userId));
}

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> deactivateProduct(@PathVariable Long id, @RequestParam Long userId) {
        return ResponseEntity.ok(productService.deactivateProduct(id, userId));
    }

    @DeleteMapping("/admin-ban/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminBanProduct(@PathVariable Long id) {
        productService.adminBanProduct(id);
        return ResponseEntity.noContent().build();
    }
    @PutMapping("/admin-unban/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminUnbanProduct(@PathVariable Long id) {
        productService.unbanProduct(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getAllPendingProducts() {
        return ResponseEntity.ok(productService.getAllPendingProducts());
    }
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ProductResponse>> getProductsByStatus(@PathVariable ProductStatus status) {
        return ResponseEntity.ok(productService.getProductsByStatus(status));
    }
    @GetMapping("/all")
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<List<ProductResponse>> getAllProductsForAdmin() {
    return ResponseEntity.ok(productService.getAllProductsForAdmin());
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


@GetMapping("/{productId}/variant-id")
public ResponseEntity<Long> getVariantIdByColorAndSize(
        @PathVariable Long productId,
        @RequestParam String color,
        @RequestParam String size) {
    
    Long variantId = productService.getVariantIdByColorAndSize(productId, color, size);
    return ResponseEntity.ok(variantId);
}

     @GetMapping("/low-stock-count")
    public ResponseEntity<Long> getLowStockCount(
            // Spring Security’nin kendi UserDetails objesi
            @AuthenticationPrincipal UserDetails principal
    ) {
        // 1) E-postayı al
        String email = principal.getUsername();

        // 2) Entity olarak user’ı çek
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Long sellerId = user.getId();
        boolean isAdmin = user.getRole().name().equals("ADMIN");

        int threshold = 5;  // isteğe göre query param’a alabilirsiniz

        long count = isAdmin
            ? analyticsService.getLowStockCountAdmin(threshold)
            : analyticsService.getLowStockCountSeller(sellerId, threshold);

        return ResponseEntity.ok(count);
    }}
