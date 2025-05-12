package com.ecommerce.backend.service;

import com.ecommerce.backend.dto.AuthResponse;
import com.ecommerce.backend.dto.LoginRequest;
import com.ecommerce.backend.dto.RegisterRequest;
import com.ecommerce.backend.dto.TokenRefreshResponse;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.RefreshToken;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.UserStatus;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.security.JwtUtils;
import com.ecommerce.backend.service.RefreshTokenService;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;

    // 🔧 Lombok yoksa constructor'ı elle yazmak zorundasın:
    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtils jwtUtils,
                       AuthenticationManager authenticationManager,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
    }
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getEmail(),
                    request.getPassword()
                )
            );
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect email or password");
        }
    
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    
        String accessToken = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());
        String refreshToken = refreshTokenService.createRefreshToken(user.getId()).getToken();
    
        return new AuthResponse(accessToken, refreshToken,  user.getId(),   user.getName(), user.getRole().name());
    }
    public TokenRefreshResponse refreshAccessToken(String refreshToken) {
        RefreshToken token = refreshTokenService.validateRefreshToken(refreshToken);
        User user = token.getUser();
        String newAccessToken = jwtUtils.generateJwtToken(user.getEmail(), user.getRole().name());
    
        return new TokenRefreshResponse(newAccessToken, refreshToken);
    }
    

    public void register(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.ROLE_USER);
        user.setUserStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }

    public void registerSeller(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_SELLER);
        user.setUserStatus(UserStatus.ACTIVE);
        user.setCorporate(request.getCorporate());
        userRepository.save(user);
    }

    public Optional<User> getCurrentUser(String email) {
        return userRepository.findByEmail(email);
    }

    public void logout(String email) {
        userRepository.findByEmail(email)
            .ifPresent(user -> refreshTokenService.deleteByUserId(user.getId()));
    }

    // inside AuthService
public void saveUpdatedUser(User user) {
    userRepository.save(user);
}

}
