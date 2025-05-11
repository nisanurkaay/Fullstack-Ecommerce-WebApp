package com.ecommerce.backend.entity;

public enum ShipmentStatus {
    PENDING,
     TRANSIT,           // satıcı SHIPPED dediğinde buraya düşecek
    AT_DISTRIBUTION_CENTER,
    AT_BRANCH,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
