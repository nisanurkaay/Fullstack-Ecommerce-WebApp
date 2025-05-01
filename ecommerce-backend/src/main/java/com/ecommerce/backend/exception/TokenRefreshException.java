package com.ecommerce.backend.exception;

public class TokenRefreshException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public TokenRefreshException(String token, String message) {
        super(String.format("Refresh token [%s] failed: %s", token, message));
    }
}
