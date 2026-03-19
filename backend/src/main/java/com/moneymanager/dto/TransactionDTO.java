package com.moneymanager.dto;

import com.moneymanager.entity.Category;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionDTO {

    @Data
    public static class Request {
        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        private BigDecimal amount;

        @NotNull(message = "Type is required")
        private Category.TransactionType type;

        @NotNull(message = "Category ID is required")
        private Long categoryId;

        private String description;

        @NotNull(message = "Date is required")
        private LocalDate date;
    }

    @Data
    public static class Response {
        private Long id;
        private BigDecimal amount;
        private Category.TransactionType type;
        private Long categoryId;
        private String categoryName;
        private String categoryIcon;
        private String description;
        private LocalDate date;
        private String createdAt;
    }
}
