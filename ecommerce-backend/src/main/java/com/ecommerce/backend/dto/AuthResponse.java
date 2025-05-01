package com.ecommerce.backend.dto;


public class AuthResponse {
    private String token;         // Access token
    private String refreshToken;  // Refresh token
    private String name;
    private String role;

    public AuthResponse(String token, String refreshToken, String name, String role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.name = name;
        this.role = role;
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

