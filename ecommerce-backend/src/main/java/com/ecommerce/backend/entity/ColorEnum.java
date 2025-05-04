package com.ecommerce.backend.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ColorEnum {
    RED, BLUE, GREEN, BLACK, WHITE, YELLOW, GRAY, PINK, PURPLE, ORANGE;

    @JsonCreator
    public static ColorEnum fromString(String key) {
        if (key == null) return null;
        try {
            return ColorEnum.valueOf(key.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null; // veya default değer döndür: return ColorEnum.BLACK;
        }
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}  