package com.ecommerce.backend.service;
import com.ecommerce.backend.entity.RefreshToken;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.repository.RefreshTokenRepository;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.exception.TokenRefreshException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Value("${jwt.refreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).get());
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> findByToken(String token) {
        System.out.println("🔍 Looking up refresh token: " + token); // BU SATIRI EKLE
        return refreshTokenRepository.findByToken(token);
    }
    

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token expired. Please sign in again.");
        }
        return token;
    }

    public void deleteByUserId(Long userId) {
         refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
    }
}
