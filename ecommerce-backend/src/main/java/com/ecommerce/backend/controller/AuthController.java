package com.ecommerce.backend.controller;
import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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
    public String registerSeller(@RequestBody RegisterRequest registerRequest) {
        authService.registerSeller(registerRequest);
        return "Seller registered successfully!";
    }
    @GetMapping("/me")
    public Optional<User> getCurrentUser(HttpServletRequest request) {
        String email = (String) request.getUserPrincipal().getName();
        return authService.getCurrentUser(email);
    }
}