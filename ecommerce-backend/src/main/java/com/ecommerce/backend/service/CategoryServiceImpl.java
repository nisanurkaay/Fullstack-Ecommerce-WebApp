package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.CategoryRequest;
import com.ecommerce.backend.dto.CategoryResponse;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.entity.Category;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
@Override
public List<ProductResponse> getProductsByCategory(Long categoryId) {
    Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));

    return category.getProducts().stream()
            .map(product -> {
                ProductResponse response = new ProductResponse();
                response.setId(product.getId());
                response.setName(product.getName());
                response.setDescription(product.getDescription());
                response.setPrice(product.getPrice());
                response.setStockQuantity(product.getStockQuantity());
                response.setProductStatus(product.getProductStatus());
                response.setCategoryName(product.getCategory().getName());
                if (product.getSeller().getCorporate() != null) {
                    response.setSellerName(product.getSeller().getCorporate());
                } else {
                    response.setSellerName(product.getSeller().getName()); // veya product.getSeller().getCompanyName()
                } // User entity'de getFullName() varsa
                return response;
            })
            .toList();
}

@Override
public CategoryResponse createCategory(CategoryRequest request) {
    if (categoryRepository.existsByName(request.getName())) {
        throw new RuntimeException("Category already exists");
    }

    Category category = new Category();
    category.setName(request.getName());
    category.setDescription(request.getDescription());

    // Alt kategori mi? varsa parent'ı ayarla
    if (request.getParentCategoryId() != null) {
        Category parent = categoryRepository.findById(request.getParentCategoryId())
                .orElseThrow(() -> new RuntimeException("Parent category not found"));
        category.setParentCategory(parent);
    }

    Category saved = categoryRepository.save(category);

    CategoryResponse response = new CategoryResponse();
    response.setId(saved.getId());
    response.setName(saved.getName());
    response.setDescription(saved.getDescription());
    response.setParentId(saved.getParentCategory() != null ? saved.getParentCategory().getId() : null);
    return response;
}
    @Override
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
                .map(cat -> {
                    CategoryResponse res = new CategoryResponse();
                    res.setId(cat.getId());
                    res.setName(cat.getName());
                    res.setDescription(cat.getDescription());
                    res.setParentId(cat.getParentCategory() != null ? cat.getParentCategory().getId() : null);
                    res.setSubcategories(null);
                    return res;
                }).toList();
    }
}
