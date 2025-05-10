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
import com.ecommerce.backend.dto.OrderResponse;
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

    // DTO'ya dönüştür (servise eklediğin method)
    OrderResponse response = orderService.mapToResponse(order);

    return ResponseEntity.ok(response);
}
   @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
            @AuthenticationPrincipal UserDetails userDetails) {

        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        List<OrderResponse> responseList;

        switch (user.getRole()) {
            case ROLE_ADMIN:
                // everyone sees every order
                responseList = orderService.getAllOrders().stream()
                    .map(orderService::mapToResponse)
                    .toList();
                break;

            case ROLE_SELLER:
                // only orders that include this seller’s products,
                // and only map the items sold by them
                responseList = orderService.getOrdersForSeller(user).stream()
                    .map(order -> orderService.mapToSellerResponse(order, user))
                    .toList();
                break;

            default:
                // buyer: only their own orders
                responseList = orderService.getOrdersByUser(user).stream()
                    .map(orderService::mapToResponse)
                    .toList();
        }

        return ResponseEntity.ok(responseList);
    }



 @PutMapping("/{orderId}/cancel-by-seller")
@PreAuthorize("hasRole('SELLER')")
public ResponseEntity<String> cancelOrderBySeller(
    @PathVariable Long orderId,
    @AuthenticationPrincipal UserDetails ud
) {
    User seller = userRepository.findByEmail(ud.getUsername())
        .orElseThrow(() -> new RuntimeException("Seller not found"));
    orderService.cancelOrderBySeller(orderId, seller);
    return ResponseEntity.ok("Sipariş iptal edildi ve ödeme iadesi gerçekleştirildi.");
}

@PutMapping("/{orderId}/items/{itemId}/cancel")
@PreAuthorize("hasRole('SELLER')")
public ResponseEntity<String> cancelItemBySeller(
    @PathVariable Long orderId,
    @PathVariable Long itemId,
    @AuthenticationPrincipal UserDetails ud
) {
    User seller = userRepository.findByEmail(ud.getUsername())
        .orElseThrow(() -> new RuntimeException("Seller not found"));
    orderService.cancelItemBySeller(orderId, itemId, seller);
    return ResponseEntity.ok("Ürün iptal edildi ve ödeme iadesi gerçekleştirildi.");
}



@PutMapping("/{orderId}/items/{itemId}/status")
@PreAuthorize("hasRole('SELLER')")
public ResponseEntity<String> updateOrderItemStatus(
        @PathVariable Long orderId,
        @PathVariable Long itemId,
        @RequestParam("status") String status,
        @AuthenticationPrincipal UserDetails userDetails) {

    User seller = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("Seller not found"));

    orderService.updateOrderItemStatus(orderId, itemId, status, seller);

    return ResponseEntity.ok("Order item status updated");
}


}
