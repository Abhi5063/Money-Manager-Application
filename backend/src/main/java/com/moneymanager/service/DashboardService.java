package com.moneymanager.service;

import com.moneymanager.dto.DashboardDTO;
import com.moneymanager.dto.TransactionDTO;
import com.moneymanager.entity.Category;
import com.moneymanager.entity.User;
import com.moneymanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final TransactionService transactionService;

    public DashboardDTO getDashboard(User user) {
        BigDecimal totalIncome = transactionRepository.sumByUserAndType(user, Category.TransactionType.INCOME);
        BigDecimal totalExpense = transactionRepository.sumByUserAndType(user, Category.TransactionType.EXPENSE);
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;
        BigDecimal balance = totalIncome.subtract(totalExpense);

        // Monthly data for last 6 months
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusMonths(5).withDayOfMonth(1);
        List<Object[]> monthlyRaw = transactionRepository.monthlyBreakdown(user, start, end);
        List<DashboardDTO.MonthlyData> monthlyData = buildMonthlyData(monthlyRaw, start, end);

        // Category breakdown for current month
        LocalDate monthStart = end.withDayOfMonth(1);
        List<Object[]> categoryRaw = transactionRepository.sumByCategory(user, monthStart, end);
        List<DashboardDTO.CategoryData> categoryData = categoryRaw.stream()
                .map(row -> new DashboardDTO.CategoryData((String) row[0], (BigDecimal) row[1]))
                .collect(Collectors.toList());

        // Recent 5 transactions
        List<TransactionDTO.Response> recent = transactionRepository.findTop5ByUserOrderByCreatedAtDesc(user)
                .stream().map(transactionService::mapToResponse).collect(Collectors.toList());

        return new DashboardDTO(totalIncome, totalExpense, balance, monthlyData, categoryData, recent);
    }

    private List<DashboardDTO.MonthlyData> buildMonthlyData(List<Object[]> raw, LocalDate start, LocalDate end) {
        List<DashboardDTO.MonthlyData> result = new ArrayList<>();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusMonths(1)) {
            final int m = d.getMonthValue();
            final int y = d.getYear();
            BigDecimal income = BigDecimal.ZERO;
            BigDecimal expense = BigDecimal.ZERO;
            for (Object[] row : raw) {
                int rowMonth = ((Number) row[0]).intValue();
                int rowYear = ((Number) row[1]).intValue();
                String type = (String) row[2];
                BigDecimal amount = (BigDecimal) row[3];
                if (rowMonth == m && rowYear == y) {
                    if ("INCOME".equals(type)) income = amount;
                    else expense = amount;
                }
            }
            result.add(new DashboardDTO.MonthlyData(m, y, income, expense));
        }
        return result;
    }
}
