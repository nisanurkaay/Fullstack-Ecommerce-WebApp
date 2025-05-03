package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CategoryRequest;
import com.ecommerce.backend.dto.CategoryResponse;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());

        if (request.getParentCategoryId() != null) {
            Category parent = categoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new RuntimeException("Parent category not found"));
            category.setParentCategory(parent);
        }

        Category saved = categoryRepository.save(category);
        return toResponse(saved);
    }

    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public List<CategoryResponse> getSubcategories(Long parentId) {
        return categoryRepository.findByParentCategoryId(parentId)
                .stream().map(this::toResponse).toList();
    }

    @Override
    public List<ProductResponse> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        return category.getProducts().stream().map(product -> {
            ProductResponse response = new ProductResponse();
            response.setId(product.getId());
            response.setName(product.getName());
            response.setDescription(product.getDescription());
            response.setPrice(product.getPrice());
            response.setStockQuantity(product.getStockQuantity());
            response.setProductStatus(product.getProductStatus());
            response.setCategoryName(product.getCategory().getName());
            response.setSellerName(product.getSeller().getName());
            return response;
        }).toList();
    }

    private CategoryResponse toResponse(Category cat) {
        CategoryResponse res = new CategoryResponse();
        res.setId(cat.getId());
        res.setName(cat.getName());
        res.setDescription(cat.getDescription());
        res.setParentId(cat.getParentCategory() != null ? cat.getParentCategory().getId() : null); // 👈 BU SATIR
        return res;
    }
    
}
