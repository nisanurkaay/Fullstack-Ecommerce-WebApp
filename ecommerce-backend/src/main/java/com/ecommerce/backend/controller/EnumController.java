package com.ecommerce.backend.controller;

import com.ecommerce.backend.entity.ColorEnum;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/enums")
public class EnumController {

    @GetMapping("/colors")
    public ResponseEntity<List<String>> getColors() {
        List<String> colorNames = Arrays.stream(ColorEnum.values())
                                        .map(Enum::name)
                                        .toList();
        return ResponseEntity.ok(colorNames);
    }
}
