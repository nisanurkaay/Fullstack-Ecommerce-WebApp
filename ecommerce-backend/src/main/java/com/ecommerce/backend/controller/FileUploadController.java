package com.ecommerce.backend.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final Path uploadDir = Paths.get("uploads");

    @PostMapping("/upload")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") MultipartFile[] files) throws IOException {
        if (!Files.exists(uploadDir)) Files.createDirectories(uploadDir);

        List<String> filePaths = new ArrayList<>();
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path target = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            filePaths.add("uploads/" + filename);
        }

        return ResponseEntity.ok(filePaths);
    }
}