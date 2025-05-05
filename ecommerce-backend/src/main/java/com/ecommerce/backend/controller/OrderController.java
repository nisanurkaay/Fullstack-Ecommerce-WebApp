package com.ecommerce.backend.controller;


import com.ecommerce.backend.dto.ProductRequest;
import com.ecommerce.backend.dto.ProductResponse;
import com.ecommerce.backend.dto.ProductVariantRequest;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.ecommerce.backend.service.FileStorageService; // Import the FileStorageService class

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.service.OrderService;
import com.ecommerce.backend.dto.OrderRequest;
import com.ecommerce.backend.entity.Order;
import org.springframework.http.HttpStatus;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired private OrderService orderService;
    @Autowired private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderService.placeOrder(user, request);
        return ResponseEntity.ok(order);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER') or hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<List<Order>> getOrders(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
        if (user.getRole().name().equals("ROLE_ADMIN")) {
            return ResponseEntity.ok(orderService.getAllOrders());
        } else if (user.getRole().name().equals("ROLE_SELLER")) {
            return ResponseEntity.ok(orderService.getOrdersForSeller(user));
        } else {
            return ResponseEntity.ok(orderService.getOrdersByUser(user));
        }
    }

    @PutMapping("/{orderId}/cancel-by-seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<String> cancelOrderBySeller(@PathVariable Long orderId) {
        orderService.cancelOrderBySeller(orderId);
        return ResponseEntity.ok("Order has been cancelled and refunded (if paid).");
    }
    
}
