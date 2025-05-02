package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request, Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        if (seller.getRole() != Role.ROLE_SELLER) {
            throw new RuntimeException("Only sellers can create products!");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setSeller(seller);
        product.setProductStatus(ProductStatus.PENDING); // ürün onay bekleyecek

        productRepository.save(product);
        return mapToResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);

        // Stok artırımı varsa ve daha önce INACTIVE ise tekrar ACTIVE yapabilir
        if (product.getProductStatus() == ProductStatus.INACTIVE &&
                product.getStockQuantity() > 0) {
            product.setProductStatus(ProductStatus.ACTIVE);
        }

        return mapToResponse(productRepository.save(product));
    }

    @Transactional
public ProductResponse approveProduct(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    if (product.getProductStatus() != ProductStatus.PENDING) {
        throw new RuntimeException("Only PENDING products can be approved.");
    }

    product.setProductStatus(ProductStatus.INACTIVE); // ✅ yayına almıyoruz
    return mapToResponse(productRepository.save(product));
}

    @Override
    @Transactional
    public void deleteProduct(Long id, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        product.setProductStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void adminBanProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setProductStatus(ProductStatus.BANNED);
        productRepository.save(product);
    }

    @Override
    @Transactional
    public ProductResponse activateProduct(Long id, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (product.getStockQuantity() == 0) {
            throw new RuntimeException("Cannot activate with 0 stock.");
        }

        product.setProductStatus(ProductStatus.ACTIVE);
        return mapToResponse(productRepository.save(product));
    }

    @Override
    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        return mapToResponse(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductResponse> getAllActiveProducts() {
        return productRepository.findByProductStatus(ProductStatus.ACTIVE)
                .stream().map(this::mapToResponse).toList();
    }

    private ProductResponse mapToResponse(Product product) {
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setDescription(product.getDescription());
        res.setPrice(product.getPrice());
        res.setStockQuantity(product.getStockQuantity());
        res.setCategoryName(product.getCategory().getName());
        res.setSellerName(product.getSeller().getName());
        res.setProductStatus(product.getProductStatus());
        return res;
    }
}
