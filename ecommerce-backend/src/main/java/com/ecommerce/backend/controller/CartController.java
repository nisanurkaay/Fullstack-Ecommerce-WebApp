package com.ecommerce.backend.controller;

import com.ecommerce.backend.dto.AddCartRequest;
import com.ecommerce.backend.dto.CartItemResponse;
import com.ecommerce.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemResponse>> getCart(
        @AuthenticationPrincipal UserDetails ud
    ) {
        return ResponseEntity.ok(cartService.getCart(ud.getUsername()));
    }

    @PostMapping
    public ResponseEntity<CartItemResponse> addToCart(
        @AuthenticationPrincipal UserDetails ud,
        @RequestBody AddCartRequest req
    ) {
        return ResponseEntity.ok(cartService.addToCart(ud.getUsername(), req));
    }

    @DeleteMapping
    public ResponseEntity<Void> removeFromCart(
        @AuthenticationPrincipal UserDetails ud,
        @RequestParam Long productId,
        @RequestParam(required = false) Long variantId
    ) {
        cartService.removeFromCart(ud.getUsername(), productId, variantId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(
        @AuthenticationPrincipal UserDetails ud
    ) {
        cartService.clearCart(ud.getUsername());
        return ResponseEntity.noContent().build();
    }
}
