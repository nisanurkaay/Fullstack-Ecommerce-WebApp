package com.ecommerce.backend.dto;

import lombok.Getter;

@Getter
public class AuthResponse {
    private String token;
    private String name;
    private String role;

    public AuthResponse(String token, String name, String role) {
        this.token = token;
        this.name = name;
        this.role = role;
    }

}

