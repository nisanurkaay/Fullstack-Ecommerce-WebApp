package com.ecommerce.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import com.ecommerce.backend.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/sellers")
    public List<User> getAllSellers() {
        return userService.getAllSellers();
    }

    @PutMapping("/{id}/ban")
    public ResponseEntity<?> banUser(@PathVariable Long id) {
        userService.banUser(id);
        return ResponseEntity.ok("User banned successfully.");
    }

    @PutMapping("/{id}/unban")
    public ResponseEntity<?> unbanUser(@PathVariable Long id) {
        userService.unbanUser(id);
        return ResponseEntity.ok("User unbanned successfully.");
    }
}