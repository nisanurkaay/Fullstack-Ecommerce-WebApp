package com.ecommerce.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ecommerce.backend.entity.Product;
import com.ecommerce.backend.entity.ProductStatus;
import com.ecommerce.backend.entity.Role;
import com.ecommerce.backend.entity.User;
import com.ecommerce.backend.entity.UserStatus;
import com.ecommerce.backend.repository.UserRepository;
import com.ecommerce.backend.repository.ProductRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getAllSellers() {
        return userRepository.findByRole(Role.ROLE_SELLER);
    }

   public void banUser(Long userId) {
    User user = userRepository.findById(userId).orElseThrow();
    user.setUserStatus(UserStatus.BANNED);

    // Eğer seller ise tüm ürünlerini de banla
    if (user.getRole() == Role.ROLE_SELLER) {
        List<Product> products = user.getProducts(); // mappedBy = "seller"
        for (Product product : products) {
            product.setProductStatus(ProductStatus.BANNED);
        }
    }

    userRepository.save(user);
}

    public void unbanUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setUserStatus(UserStatus.ACTIVE);

        if (user.getRole() == Role.ROLE_SELLER) {
            List<Product> products = user.getProducts();
            for (Product product : products) {
                if (product.getProductStatus() == ProductStatus.BANNED) {
                    product.setProductStatus(ProductStatus.INACTIVE); // ya da PENDING
                }
            }
            productRepository.saveAll(products);
        }
        userRepository.save(user);


    }
}
