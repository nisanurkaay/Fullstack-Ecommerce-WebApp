package com.ecommerce.backend.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;


@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}") // access token süresi
    private int jwtExpirationMs;

    @Value("${jwt.refreshExpirationMs}") // refresh token süresi
    private int refreshExpirationMs;

    // Eski method bozulmasın diye bıraktık (geri uyumlu)
    public String generateJwtToken(String username, String role) {
        return generateToken(username, role, jwtExpirationMs);
    }

    // Yeni: Refresh Token üretimi
    public String generateRefreshToken(String username, String role) {
        return generateToken(username, role, refreshExpirationMs);
    }

    // Ortak token üretim fonksiyonu
    private String generateToken(String username, String role, int expirationMs) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expirationMs))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String getUsernameFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromJwtToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(authToken);
            return true;
        } catch (ExpiredJwtException e) {
            System.out.println("JWT expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.out.println("JWT unsupported: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.out.println("JWT malformed: " + e.getMessage());
        } catch (SignatureException e) {
            System.out.println("JWT signature invalid: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT illegal argument: " + e.getMessage());
        }
        return false;
    }
}
