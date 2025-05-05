package com.ecommerce.backend.dto;

import java.time.LocalDateTime;

public class ApiErrorResponse {
    private String error;
    private int status;
    private LocalDateTime timestamp;

    public ApiErrorResponse(String error, int status) {
        this.error = error;
        this.status = status;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters (or use a record if you're on Java 16+)
    
    
        public String getError() {
            return error;
        }
    
        public void setError(String error) {
            this.error = error;
        }
    
        public int getStatus() {
            return status;
        }
    
        public void setStatus(int status) {
            this.status = status;
        }
    
        public LocalDateTime getTimestamp() {
            return timestamp;
        }
}
