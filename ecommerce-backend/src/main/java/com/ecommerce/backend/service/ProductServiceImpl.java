package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.ProductVariantRequest;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper; 
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final FileStorageService fileStorageService;
    private final ModelMapper modelMapper;


    public ProductServiceImpl(ProductRepository productRepository,
                              UserRepository userRepository,
                              CategoryRepository categoryRepository, 
                              FileStorageService fileStorageService,
                                ModelMapper modelMapper
                              ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.fileStorageService = fileStorageService;
        this.modelMapper = modelMapper;
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
        product.setProductStatus(ProductStatus.PENDING);
        
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            product.setImageUrls(request.getImageUrls()); // ✅ Liste olarak set et
        }
        
    
        // ✅ Varyantları oluştur
        List<ProductVariant> variantEntities = new ArrayList<>();
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductVariantRequest variantReq : request.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setColor(variantReq.getColor());
                variant.setSize(variantReq.getSize());
                variant.setStock(variantReq.getStock());
                variant.setPrice(variantReq.getPrice());
                variant.setImageUrls(variantReq.getImageUrls());
                variant.setProduct(product);
                variantEntities.add(variant);
            }
        }
    
        product.setVariants(variantEntities);
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
public List<ProductResponse> getProductsByStatus(ProductStatus status) {
    return productRepository.findByProductStatus(status)
            .stream()
            .map(this::mapToResponse)
            .toList();
}

@Override
public ProductResponse denyProduct(Long id) {
    Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    product.setProductStatus(ProductStatus.BANNED);
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
    public List<ProductResponse> getAllPendingProducts() {
        return productRepository.findByProductStatus(ProductStatus.PENDING)
                .stream().map(this::mapToResponse).toList();
    }
    @Override
    public List<ProductResponse> getProductsBySeller(Long sellerId) {
        return productRepository.findBySellerId(sellerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
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
        res.setCategoryId(product.getCategory().getId());
        res.setVariants(product.getVariants());
        res.setImageUrls(product.getImageUrls());
        res.setSellerName(product.getSeller().getName());
        res.setProductStatus(product.getProductStatus());
        return res;
    }
    
    @Override
public ProductResponse addVariantToProduct(Long productId, ProductVariantRequest variantRequest) {
    Product product = productRepository.findById(productId)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    ProductVariant variant = new ProductVariant();
    variant.setColor(variantRequest.getColor());
    variant.setSize(variantRequest.getSize());
    variant.setPrice(variantRequest.getPrice());
    variant.setStock(variantRequest.getStock());
    variant.setImageUrls(variantRequest.getImageUrls());
    variant.setProduct(product);

    product.getVariants().add(variant);
    productRepository.save(product); // cascade varsa bu yeterli

    return modelMapper.map(product, ProductResponse.class); // veya özel dönüştürme
}

}
