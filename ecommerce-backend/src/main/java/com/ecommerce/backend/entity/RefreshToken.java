package com.ecommerce.backend.entity;

import jakarta.persistence.*;



import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")

public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    public Instant getExpiryDate() {
        return expiryDate;
    }
    public Long getId() {
        return id;
    }
    public String getToken() {
        return token;
    }
    public User getUser() {
        return user;
    }
    public void setExpiryDate(Instant expiryDate) {
        this.expiryDate = expiryDate;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setToken(String token) {
        this.token = token;
    }
    public void setUser(User user) {
        this.user = user;
    }
    
}
