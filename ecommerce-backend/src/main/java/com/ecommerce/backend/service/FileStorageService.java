package com.ecommerce.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.UUID;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final Path uploadDir = Paths.get("uploads");

    public String saveFile(MultipartFile file) {
        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("File storage failed", e);
        }
    }

    public List<String> saveAll(MultipartFile[] files) {
    List<String> paths = new ArrayList<>();
    for (MultipartFile file : files) {
        paths.add(saveFile(file)); // yukarıdaki metod zaten var
    }
    return paths;
}
}
