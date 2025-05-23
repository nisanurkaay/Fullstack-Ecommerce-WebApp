package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CategoryRequest;
import com.ecommerce.backend.dto.CategoryResponse;
import com.ecommerce.backend.dto.ProductResponse;

import java.util.List;

public interface CategoryService {
    CategoryResponse createCategory(CategoryRequest request);
    List<CategoryResponse> getAllCategories();
    List<CategoryResponse> getSubcategories(Long parentId); // ✅ BURAYI EKLE
    List<ProductResponse> getProductsByCategory(Long categoryId);
    List<CategoryResponse> getTopCategoriesByProductCount();
}
