package com.ecommerce.backend.entity;
import jakarta.persistence.*;


import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

  
    @Column(nullable = false)
    private String name;


    @Column(nullable = false, unique = true)
    private String email;


    @Column(nullable = false)
    private String password;


    @Enumerated(EnumType.STRING)
    private Role role;


    @Enumerated(EnumType.STRING)
    @Column(name = "user_status")
    private UserStatus userStatus;


    private String corporate; // şirket adı sadece seller için

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public User() {}

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public Role getRole() { return role; }
    public UserStatus getUserStatus() { return userStatus; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public String getCorporate() { return corporate; }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.userStatus = UserStatus.ACTIVE;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
 
 
    }
public void setCorporate(String corporate) {
    this.corporate = corporate;
}
public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
}
public void setEmail(String email) {
    this.email = email;
}
public void setId(Long id) {
    this.id = id;
}
public void setName(String name) {
    this.name = name;
}
public void setPassword(String password) {
    this.password = password;
}
public void setRole(Role role) {
    this.role = role;
}
public void setUpdatedAt(LocalDateTime updatedAt) {
    this.updatedAt = updatedAt;
}
public void setUserStatus(UserStatus userStatus) {
    this.userStatus = userStatus;
}

@OneToMany(mappedBy = "seller")
@JsonIgnore // veya @JsonManagedReference
private List<Product> products;

public void setProducts(List<Product> products) {
    this.products = products;
}

public List<Product> getProducts() {
    return products;
}
}
