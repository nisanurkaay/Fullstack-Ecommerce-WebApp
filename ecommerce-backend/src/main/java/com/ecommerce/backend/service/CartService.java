package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.AddCartRequest;
import com.ecommerce.backend.dto.CartItemResponse;
import com.ecommerce.backend.entity.CartItem;
import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductVariant;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.CartItemRepository;
import com.ecommerce.backend.repository.ProductRepository;
import com.ecommerce.backend.repository.ProductVariantRepository;
import com.ecommerce.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {
    @Autowired private CartItemRepository cartRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private ProductRepository prodRepo;
    @Autowired private ProductVariantRepository varRepo;

    public List<CartItemResponse> getCart(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                            .orElseThrow(() -> new RuntimeException("User not found"));
        List<CartItem> items = cartRepo.findByUser(user);
        return items.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public CartItemResponse addToCart(String userEmail, AddCartRequest req) {
        User user = userRepo.findByEmail(userEmail)
                            .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = prodRepo.findById(req.getProductId())
                                  .orElseThrow(() -> new RuntimeException("Product not found"));

        // Burada variant'ı final yapıyoruz
        final ProductVariant variant = Optional.ofNullable(req.getVariantId())
            .map(varRepo::findById)
            .flatMap(opt -> opt)
            .orElse(null);

        // Mevcut cartItem varsa artır, yoksa yeni oluştur
        Optional<CartItem> existing = cartRepo.findByUserAndProductIdAndVariantId(
            user, product.getId(),
            variant != null ? variant.getId() : null
        );

        CartItem ci = existing
            .map(e -> {
                e.setQuantity(e.getQuantity() + req.getQuantity());
                return e;
            })
            .orElseGet(() -> new CartItem(user, product, variant, req.getQuantity()));

        CartItem saved = cartRepo.save(ci);
        return toResponse(saved);
    }

    @Transactional
    public void removeFromCart(String userEmail, Long productId, Long variantId) {
        User user = userRepo.findByEmail(userEmail)
                            .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepo.deleteByUserAndProductIdAndVariantId(user, productId, variantId);
    }

    @Transactional
    public void clearCart(String userEmail) {
        User user = userRepo.findByEmail(userEmail)
                            .orElseThrow(() -> new RuntimeException("User not found"));
        cartRepo.deleteByUser(user);
    }

    private CartItemResponse toResponse(CartItem ci) {
        CartItemResponse r = new CartItemResponse();
        r.setId(ci.getId());
        r.setProductId(ci.getProduct().getId());
        r.setProductName(ci.getProduct().getName());
        r.setProductImage(
          ci.getProduct().getImageUrls().stream().findFirst().orElse(null)
        );

        ProductVariant var = ci.getVariant();
        if (var != null) {
            r.setVariantId(var.getId());
            // Variant adı olarak örneğin "Renk:RED, Beden:M" gibi birleştirme yapabilirsiniz
            String variantName = "Color:" + var.getColor().name() + ", Size:" + var.getSize();
            r.setVariantName(variantName);
            r.setPrice(var.getPrice());
        } else {
            r.setVariantId(null);
            r.setVariantName(null);
            r.setPrice(ci.getProduct().getPrice());
        }

        r.setQuantity(ci.getQuantity());
        return r;
    }
}
