package com.ecommerce.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserStatus;
import com.ecommerce.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllSellers() {
        return userRepository.findByRole(Role.ROLE_SELLER);
    }

    public void banUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setUserStatus(UserStatus.BANNED);
        userRepository.save(user);
    }

    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setUserStatus(UserStatus.ACTIVE);
        userRepository.save(user);
    }
}
