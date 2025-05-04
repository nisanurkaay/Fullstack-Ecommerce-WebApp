package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  // Find a user by email
    boolean existsByEmail(String email);  // Check if a user exists by email
    List<User> findByRole(Role role);
}
