package com.ecommerce.backend.dto;


public class AuthResponse {
    private Long id;            // User ID
    private String token;         // Access token
    private String refreshToken;  // Refresh token
    private String name;
    private String role;

    public AuthResponse(String token, String refreshToken, Long id, String name, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.id = id;
        this.name = name;
        this.role = role;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
    public String getName() {
        return name;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
    public String getRole() {
        return role;
    }
    public String getToken() {
        return token;
    }
    public void setName(String name) {
        this.name = name;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public void setToken(String token) {
        this.token = token;
    }

    
}

