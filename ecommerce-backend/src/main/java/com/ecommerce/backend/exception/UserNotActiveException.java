package com.ecommerce.backend.exception;

public class UserNotActiveException extends RuntimeException {
    public UserNotActiveException() {
        super("Only active users can place orders.");
    }
}