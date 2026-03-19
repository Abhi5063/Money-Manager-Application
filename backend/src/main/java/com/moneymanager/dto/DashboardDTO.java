package com.moneymanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardDTO {
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal balance;
    private List<MonthlyData> monthlyData;
    private List<CategoryData> categoryData;
    private List<TransactionDTO.Response> recentTransactions;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyData {
        private int month;
        private int year;
        private BigDecimal income;
        private BigDecimal expense;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryData {
        private String category;
        private BigDecimal amount;
    }
}
