package com.moneymanager.service;

import com.moneymanager.dto.BudgetDTO;
import com.moneymanager.entity.Budget;
import com.moneymanager.entity.Category;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.BudgetRepository;
import com.moneymanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryService categoryService;
    private final TransactionRepository transactionRepository;

    public List<BudgetDTO.Response> getBudgets(User user, Integer month, Integer year) {
        List<Budget> budgets;
        if (month != null && year != null) {
            budgets = budgetRepository.findByUserAndMonthAndYear(user, month, year);
        } else {
            LocalDate now = LocalDate.now();
            budgets = budgetRepository.findByUserAndMonthAndYear(user, now.getMonthValue(), now.getYear());
        }
        return budgets.stream().map(b -> mapToResponse(b, user)).collect(Collectors.toList());
    }

    public BudgetDTO.Response createBudget(BudgetDTO.Request request, User user) {
        Category category = categoryService.getCategoryEntity(request.getCategoryId(), user);
        Budget budget = Budget.builder()
                .category(category)
                .limitAmount(request.getLimitAmount())
                .month(request.getMonth())
                .year(request.getYear())
                .user(user)
                .build();
        return mapToResponse(budgetRepository.save(budget), user);
    }

    public BudgetDTO.Response updateBudget(Long id, BudgetDTO.Request request, User user) {
        Budget budget = budgetRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budget.setLimitAmount(request.getLimitAmount());
        return mapToResponse(budgetRepository.save(budget), user);
    }

    private BudgetDTO.Response mapToResponse(Budget budget, User user) {
        BudgetDTO.Response response = new BudgetDTO.Response();
        response.setId(budget.getId());
        response.setCategoryId(budget.getCategory().getId());
        response.setCategoryName(budget.getCategory().getName());
        response.setCategoryIcon(budget.getCategory().getIcon());
        response.setLimitAmount(budget.getLimitAmount());
        response.setMonth(budget.getMonth());
        response.setYear(budget.getYear());

        LocalDate start = LocalDate.of(budget.getYear(), budget.getMonth(), 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());
        BigDecimal spent = transactionRepository.sumExpenseByCategoryAndDateBetween(user, budget.getCategory(), start, end);
        response.setSpent(spent != null ? spent : BigDecimal.ZERO);
        return response;
    }
}
