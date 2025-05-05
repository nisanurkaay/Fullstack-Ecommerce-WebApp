package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.ProductVariantRequest;
import com.ecommerce.backend.dto.ProductVariantResponse;
import com.ecommerce.backend.entity.*;
import com.ecommerce.backend.repository.CategoryRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.modelmapper.ModelMapper; 
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;




// import com.ecommerce.backend.util.EnumUtils; // Removed as the class is not found

import java.util.stream.Stream;

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
                if ((request.getVariants() == null || request.getVariants().isEmpty()) && request.getColor() == null) {
                    throw new RuntimeException("Varyantsız ürünlerde color zorunludur.");
                }
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setSeller(seller);
        product.setColor(request.getColor());
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
                variant.setProductStatus(ProductStatus.PENDING);
                variantEntities.add(variant);
            }
        }
    
        product.setVariants(variantEntities);
        productRepository.save(product);
    
        return mapToResponse(product);
    }

@Override
public List<String> getUsedColors() {
    Set<String> colorSet = new HashSet<>();

    // Ana ürün renkleri (eğer varyant yoksa)
    productRepository.findAll().stream()
        .map(Product::getColor)
        .filter(Objects::nonNull)
        .map(Enum::name)
        .forEach(colorSet::add);

    // Varyant renkleri
    productRepository.findAll().stream()
        .flatMap(p -> p.getVariants() != null ? p.getVariants().stream() : Stream.empty())
        .map(ProductVariant::getColor)
        .filter(Objects::nonNull)
        .map(Enum::name)
        .forEach(colorSet::add);

    return new ArrayList<>(colorSet);
}

    @Override
public List<ProductResponse> filterProducts(Long categoryId, List<String> colors, List<String> sizes) {
    List<Product> products = productRepository.findAllWithFilters(categoryId, colors, sizes);
    return products.stream().map(ProductResponse::fromEntity).toList();
}
@Override
public List<ProductResponse> filterProductsByRole(Long categoryId, List<String> colors, List<String> sizes, Long userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    List<Product> products;

    if (user.getRole() == Role.ROLE_ADMIN) {
        // Admin: tüm ürünlerde filtre uygula
        products = productRepository.findAllWithFilters(categoryId, colors, sizes);
    } else if (user.getRole() == Role.ROLE_SELLER) {
        // Seller: sadece kendi ürünlerinde filtre uygula
        products = productRepository.findBySellerId(userId).stream()
                .filter(p -> (categoryId == null || p.getCategory().getId().equals(categoryId)) &&
                             (colors == null || colors.contains(p.getColor().name()) ||
                              p.getVariants().stream().anyMatch(v -> colors.contains(v.getColor().name()))) &&
                             (sizes == null || p.getVariants().stream().anyMatch(v -> sizes.contains(v.getSize()))))
                .toList();
    } else {
        // User: sadece ACTIVE ürünlerde filtre uygula
        products = productRepository.findAllWithFilters(categoryId, colors, sizes).stream()
                .filter(p -> p.getProductStatus() == ProductStatus.ACTIVE)
                .toList();
    }

    return products.stream().map(ProductResponse::fromEntity).toList();
}

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    
        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
    
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
    
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
        product.setCategory(category);
    
        // 🔁 Görselleri güncelle
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            product.setImageUrls(request.getImageUrls());
        }
    
        // 🔁 Varyantları güncelle
        if (request.getVariants() != null) {
            List<ProductVariant> updatedVariants = new ArrayList<>();
            for (ProductVariantRequest vr : request.getVariants()) {
                ProductVariant variant = new ProductVariant();
                variant.setColor(vr.getColor());


                variant.setSize(vr.getSize());
                variant.setStock(vr.getStock());
                variant.setPrice(vr.getPrice());
                variant.setImageUrls(vr.getImageUrls());
                variant.setProduct(product);
                updatedVariants.add(variant);
            }
            product.setVariants(updatedVariants);
        }
    
        return mapToResponse(productRepository.save(product));
    }
    @Override
    public void deleteVariant(Long productId, Long variantId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
    
        List<ProductVariant> variants = product.getVariants();
    
        // Hedef varyantı bul
        ProductVariant variantToRemove = variants.stream()
            .filter(v -> v.getId().equals(variantId))
            .findFirst()
            .orElseThrow(() -> new RuntimeException("Variant not found"));
    
        variants.remove(variantToRemove);
    
        // Eğer bu son varyantsa → ürünü sil
        if (variants.size() == 0) {
            productRepository.delete(product);
        } else {
            product.setVariants(variants);
            productRepository.save(product);
        }
    }
      @Override
public void hardDelete(Long id, Long userId) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    if (!product.getSeller().getId().equals(userId)) {
        throw new RuntimeException("Unauthorized");
    }

    productRepository.delete(product); // Cascade ile varyantlar da silinir
}
    @Transactional
public ProductResponse approveProduct(Long id) {
    Product product = productRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));

    if (product.getProductStatus() != ProductStatus.PENDING) {
        throw new RuntimeException("Only PENDING products can be approved.");
    }

    product.setProductStatus(ProductStatus.INACTIVE);

    // ✅ Varyantlar da INACTIVE yapılmalı
    if (product.getVariants() != null) {
        for (ProductVariant v : product.getVariants()) {
            if (v.getProductStatus() == ProductStatus.PENDING) {
                v.setProductStatus(ProductStatus.INACTIVE);
            }
        }
    }

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
    public void unbanProduct(Long id) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setProductStatus(ProductStatus.INACTIVE); // veya önceki durumu varsa onu çek
    
        if (product.getVariants() != null) {
            product.getVariants().forEach(v -> v.setProductStatus(ProductStatus.INACTIVE));
        }
    
        productRepository.save(product);
    }
    
    public List<ProductResponse> getAllProductsForAdmin() {
        return productRepository.findAll().stream()
            .map(this::mapToResponse)
            .toList();
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
@Transactional
public ProductResponse activateProductWithVariants(Long productId, Long sellerId) {
    Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

    if (!product.getSeller().getId().equals(sellerId)) {
        throw new RuntimeException("Unauthorized");
    }

    if (product.getVariants() == null || product.getVariants().isEmpty()) {
        throw new RuntimeException("This product has no variants.");
    }

    for (ProductVariant v : product.getVariants()) {
        if (v.getStock() == 0) {
            throw new RuntimeException("Cannot activate. Variant with size " + v.getSize() + " has 0 stock.");
        }
        if (v.getImageUrls() == null || v.getImageUrls().size() != 3) {
            throw new RuntimeException("Each variant must have exactly 3 images.");
        }
    }
    product.setProductStatus(ProductStatus.ACTIVE);

    if (product.getVariants() != null) {
        for (ProductVariant v : product.getVariants()) {
            if (v.getProductStatus() == ProductStatus.INACTIVE) {
                v.setProductStatus(ProductStatus.ACTIVE); // ✅ Admin onayladıysa yayına alınır
            }
        }
    }
    
    return mapToResponse(productRepository.save(product));
}

    @Override
    @Transactional
    public ProductResponse deactivateProduct(Long id, Long userId) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    
        if (!product.getSeller().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
    
        product.setProductStatus(ProductStatus.INACTIVE);
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
        res.setSellerName(product.getSeller().getName());
        res.setProductStatus(product.getProductStatus());
        res.setColor(product.getColor());
    
        // ✅ Varyantları DTO'ya çevir
        List<ProductVariantResponse> variantResponses = product.getVariants()
            .stream()
            .map(ProductVariantResponse::fromEntity)
            .toList();
        res.setVariants(variantResponses);
    
        // ✅ Görsel belirleme
        if (product.getImageUrls() != null && !product.getImageUrls().isEmpty()) {
            res.setImageUrls(product.getImageUrls());
        } else if (!variantResponses.isEmpty() && variantResponses.get(0).getImageUrls() != null) {
            res.setImageUrls(variantResponses.get(0).getImageUrls()); // 🔥 Varyanttan ilk görsel set edilir
        } else {
            res.setImageUrls(new ArrayList<>()); // tamamen boşsa
        }
    
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
    if (variant.getStock() > 0) {
        variant.setProductStatus(ProductStatus.ACTIVE);
    } else {
        variant.setProductStatus(ProductStatus.INACTIVE);
    }
    
    productRepository.save(product); // cascade varsa bu yeterli

    return modelMapper.map(product, ProductResponse.class); // veya özel dönüştürme
}

}
