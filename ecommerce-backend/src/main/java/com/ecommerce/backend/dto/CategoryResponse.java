package com.ecommerce.backend.dto;
import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;

    // Getter - Setter

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
