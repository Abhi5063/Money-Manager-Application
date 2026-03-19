package com.moneymanager.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;

public class BudgetDTO {

    @Data
    public static class Request {
        @NotNull
        private Long categoryId;

        @NotNull
        @Positive
        private BigDecimal limitAmount;

        @NotNull
        private int month;

        @NotNull
        private int year;
    }

    @Data
    public static class Response {
        private Long id;
        private Long categoryId;
        private String categoryName;
        private String categoryIcon;
        private BigDecimal limitAmount;
        private BigDecimal spent;
        private int month;
        private int year;

        public double getPercentage() {
            if (limitAmount == null || limitAmount.doubleValue() == 0) return 0;
            return Math.min(100, (spent.doubleValue() / limitAmount.doubleValue()) * 100);
        }
    }
}
