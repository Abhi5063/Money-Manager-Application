package com.moneymanager.dto;

import com.moneymanager.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class CategoryDTO {

    @Data
    public static class Request {
        @NotBlank(message = "Category name is required")
        private String name;

        @NotNull(message = "Category type is required")
        private Category.TransactionType type;

        private String icon;
    }

    @Data
    public static class Response {
        private Long id;
        private String name;
        private Category.TransactionType type;
        private String icon;
    }
}
