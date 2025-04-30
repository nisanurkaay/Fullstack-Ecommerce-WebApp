package com.ecommerce.backend.dto;

import com.ecommerce.backend.entity.Role;

import lombok.Data;


@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
}