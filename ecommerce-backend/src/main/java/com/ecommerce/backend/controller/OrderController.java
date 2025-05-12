package com.ecommerce.backend.controller;



import com.ecommerce.backend.dto.TopSellerDto;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


import com.ecommerce.backend.service.AnalyticsService;
// Import the FileStorageService class

import java.util.List;

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

     private final OrderService orderService;
    private final AnalyticsService analyticsService;
    private final UserRepository userRepository;

    @Autowired
    public OrderController(OrderService orderService,
                           AnalyticsService analyticsService,
                           UserRepository userRepository) {
        this.orderService     = orderService;
        this.analyticsService = analyticsService;
        this.userRepository   = userRepository;
    }
 @PostMapping
public ResponseEntity<?> createOrder(@RequestBody OrderRequest request,
                                     @AuthenticationPrincipal UserDetails userDetails) {
    User user = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

    Order order = orderService.placeOrder(user, request);


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
                responseList = orderService.getAllOrders().stream()
                    .map(orderService::mapToResponse)
                    .toList();
                break;

            case ROLE_SELLER:
                
                responseList = orderService.getOrdersForSeller(user).stream()
                    .map(order -> orderService.mapToSellerResponse(order, user))
                    .toList();
                break;

            default:
               
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


  @PutMapping("/{orderId}/cancel")
  @PreAuthorize("hasRole('USER') or hasRole('CUSTOMER')")
  public ResponseEntity<String> cancelOrderByCustomer(
      @PathVariable Long orderId,
      @AuthenticationPrincipal UserDetails ud
  ) {
    User customer = userRepository.findByEmail(ud.getUsername())
        .orElseThrow(() -> new RuntimeException("User not found"));

    orderService.cancelOrderByCustomer(orderId, customer);
    return ResponseEntity.ok("Siparişiniz başarıyla iptal edildi ve ödemeniz iade edildi.");
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
   @GetMapping("/return-rate")
    public ResponseEntity<Double> getReturnRate(
            @AuthenticationPrincipal UserDetails principal
    ) {
        User user = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isAdmin = user.getRole().name().equals("ADMIN");
        double rate = isAdmin
            ? analyticsService.getReturnRateAdmin()
            : analyticsService.getReturnRateSeller(user.getId());

        return ResponseEntity.ok(rate);
    }

    /**
     *  Top 5 sellers (admin only):
     *  /api/orders/top-sellers?topN=5
     */
   @GetMapping("/top-sellers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TopSellerDto>> getTopSellers(
            @RequestParam(defaultValue = "5") int topN) {

        List<TopSellerDto> raw = analyticsService.getTopSellersAdmin(topN);

        List<TopSellerDto> enriched = raw.stream().map(dto -> {
            User u = userRepository.findById(dto.sellerId())
                      .orElseThrow(() -> new RuntimeException("Seller not found"));
            return new TopSellerDto(
                dto.sellerId(),
                u.getName(),         // veya u.getUsername()
                dto.revenue()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(enriched);
    }
}
