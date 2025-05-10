package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.CategoryRequest;
import com.ecommerce.backend.dto.CategoryResponse;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.AnalyticsService;
import com.ecommerce.backend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.util.List;
import java.util.Map;
import com.ecommerce.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;


    public CategoryController(CategoryService categoryService,
    AnalyticsService analyticsService,
    UserRepository userRepository) {
        this.categoryService = categoryService;
        this.analyticsService = analyticsService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<CategoryResponse>> getSubcategories(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getSubcategories(id));
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<List<ProductResponse>> getProductsByCategory(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getProductsByCategory(id));
    }
  @GetMapping("/top")
public ResponseEntity<List<CategoryResponse>> getTopCategoriesByProductCount() {
    return ResponseEntity.ok(categoryService.getTopCategoriesByProductCount());
}
 @GetMapping("/top-sales")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ResponseEntity<List<Map<String,Object>>> getTopSales(
            @AuthenticationPrincipal UserDetails principal,      // JWT’den gelen user
            @RequestParam(defaultValue = "5") int topN) {

        // 1) Giriş yapan kullanıcının email’ini al
        String email = principal.getUsername();

        // 2) User entity’sini çek
        User user = userRepository.findByEmail(email)
                   .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRole() == Role.ROLE_ADMIN;   // veya .name().equals("ADMIN")

        // 3) Rolüne göre servis metodunu seç
        List<Map<String,Object>> result = isAdmin
            ? analyticsService.getTopCategoriesAdmin(topN)
            : analyticsService.getTopCategoriesSeller(user.getId(), topN);

        return ResponseEntity.ok(result);
    }

} 
