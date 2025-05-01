package com.ecommerce.backend.dto;
import java.util.List;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private Long parentId;
    private List<CategoryResponse> subcategories;



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

    public String getDescription() {
        return description;
    }
    public Long getParentId() {
        return parentId;
    }

    public List<CategoryResponse> getSubcategories() {
        return subcategories;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
    public void setSubcategories(List<CategoryResponse> subcategories) {
        this.subcategories = subcategories;
    }
}
