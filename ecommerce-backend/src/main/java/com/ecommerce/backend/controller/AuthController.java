package com.ecommerce.backend.controller;
import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.dto.TokenRefreshRequest;
import com.ecommerce.backend.dto.TokenRefreshResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.JwtUtils;
import com.ecommerce.backend.service.AuthService;
import com.ecommerce.backend.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
    private RefreshTokenService refreshTokenService;
  @Autowired
    private JwtUtils jwtUtils;
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest registerRequest) {
        authService.register(registerRequest);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        System.out.println("Login endpoint hit!");
        return ResponseEntity.ok(authService.login(request));
    }

   @PostMapping("/register-seller")
public ResponseEntity<Map<String, String>> registerSeller(@RequestBody RegisterRequest registerRequest) {
    authService.registerSeller(registerRequest);
    Map<String, String> response = new HashMap<>();
    response.put("message", "Seller registered successfully!");
    return ResponseEntity.ok(response);
}
    @GetMapping("/me")
public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
    Principal principal = request.getUserPrincipal();
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Kullanıcı doğrulanmadı");
    }

    
    Optional<User> optionalUser = authService.getCurrentUser(principal.getName());
    return optionalUser
        .<ResponseEntity<?>>map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Kullanıcı bulunamadı"));
}

@PostMapping("/refresh-token")
public ResponseEntity<TokenRefreshResponse> refreshAccessToken(@RequestBody TokenRefreshRequest request) {
    return ResponseEntity.ok(authService.refreshAccessToken(request.getRefreshToken()));
}



}