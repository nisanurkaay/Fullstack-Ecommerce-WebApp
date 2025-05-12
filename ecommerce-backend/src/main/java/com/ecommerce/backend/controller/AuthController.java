package com.ecommerce.backend.controller;
import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.dto.TokenRefreshRequest;
import com.ecommerce.backend.dto.TokenRefreshResponse;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.security.JwtUtils;
import com.ecommerce.backend.service.AuthService;
import com.ecommerce.backend.service.RefreshTokenService;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final PasswordEncoder passwordEncoder;
  @Autowired
    private RefreshTokenService refreshTokenService;
  @Autowired
    private JwtUtils jwtUtils;
    private final AuthService authService;

    public AuthController(AuthService authService, PasswordEncoder passwordEncoder) {
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
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
@PutMapping("/me")
@PreAuthorize("isAuthenticated()")
public ResponseEntity<?> updateCurrentUser(Principal principal,
                                           @RequestBody Map<String, String> updates) {
    User user = authService.getCurrentUser(principal.getName())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    // Update name/email
    if (updates.containsKey("name"))  user.setName(updates.get("name"));
    if (updates.containsKey("email")) user.setEmail(updates.get("email"));

    // Update corporate if seller
    if (updates.containsKey("corporate") && user.getRole() == Role.ROLE_SELLER) {
      user.setCorporate(updates.get("corporate"));
    }

    // Update password if provided
    if (updates.containsKey("password") && !updates.get("password").isBlank()) {
      user.setPassword(passwordEncoder.encode(updates.get("password")));
    }

    authService.saveUpdatedUser(user);
    return ResponseEntity.ok("Profil güncellendi");
}

@PostMapping("/refresh-token")
public ResponseEntity<TokenRefreshResponse> refreshAccessToken(@RequestBody TokenRefreshRequest request) {
    return ResponseEntity.ok(authService.refreshAccessToken(request.getRefreshToken()));
}



}