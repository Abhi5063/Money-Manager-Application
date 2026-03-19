package com.moneymanager.repository;

import com.moneymanager.entity.Budget;
import com.moneymanager.entity.Category;
import com.moneymanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    List<Budget> findByUserAndMonthAndYear(User user, int month, int year);
    Optional<Budget> findByUserAndCategoryAndMonthAndYear(User user, Category category, int month, int year);
    Optional<Budget> findByIdAndUser(Long id, User user);
    List<Budget> findByUser(User user);
}
