package com.ecommerce.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.ecommerce.backend.dto.ApiErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect email or password");
    }
    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<?> handleEmailExists(EmailAlreadyExistsException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage()); // veya custom JSON dön
    }
  @ExceptionHandler(UserNotActiveException.class)
public ResponseEntity<ApiErrorResponse> handleUserNotActive(UserNotActiveException ex) {
    ApiErrorResponse error = new ApiErrorResponse(ex.getMessage(), HttpStatus.FORBIDDEN.value());
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
}

@ExceptionHandler(OutOfStockException.class)
public ResponseEntity<ApiErrorResponse> handleOutOfStock(OutOfStockException ex) {
    ApiErrorResponse error = new ApiErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST.value());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
}

}
