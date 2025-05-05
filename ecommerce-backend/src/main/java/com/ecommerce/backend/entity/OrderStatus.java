package com.ecommerce.backend.entity;
public enum OrderStatus {
    PLACED,         // Sipariş verildi (ödemesi alındı)
    PROCESSING,     // Hazırlanıyor
    SHIPPED,        // Kargoya verildi
    DELIVERED,      // Teslim edildi
    CANCELLED,      // Satıcı veya kullanıcı iptal etti
    REFUNDED        // Ödeme iade edildi
}
