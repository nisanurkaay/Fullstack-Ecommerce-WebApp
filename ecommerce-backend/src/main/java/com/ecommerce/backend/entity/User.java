package com.ecommerce.backend.entity;
import jakarta.persistence.*;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "users")
public class User {

    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    @Column(nullable = false, unique = true)
    private String email;

    @Setter
    @Column(nullable = false)
    private String password;

    @Setter
    @Enumerated(EnumType.STRING)
    private Role role;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(name = "user_status") //
    private UserStatus userStatus; //

    private LocalDateTime createdAt;
    @Setter
    private LocalDateTime updatedAt;

    public User() {}

    public Long getId() {
        return id;
    }

    public UserStatus getUserStatus() {
        return userStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {}

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public Role getRole() {
        return role;
    }


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.userStatus = UserStatus.ACTIVE; // Yeni kullanıcı oluşturulunca ACTIVE olsun
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now(); // Her güncellemede updatedAt otomatik değişsin
    }
}