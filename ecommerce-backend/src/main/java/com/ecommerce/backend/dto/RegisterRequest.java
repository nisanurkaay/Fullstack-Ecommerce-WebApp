package com.ecommerce.backend.dto;
import com.ecommerce.backend.entity.Role;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String corporate;
    private Boolean isIndividual;
    private Role role;

    public String getName() {
        return name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCorporate() {
        return corporate;
    }

    public void setCorporate(String corporate) {
        this.corporate = corporate;
    }

    public Boolean getIsIndividual() {
        return isIndividual;
    }
    public void setIsIndividual(Boolean isIndividual) {
        this.isIndividual = isIndividual;
    }
}
