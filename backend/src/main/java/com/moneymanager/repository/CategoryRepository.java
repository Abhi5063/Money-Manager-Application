package com.moneymanager.repository;

import com.moneymanager.entity.Category;
import com.moneymanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByUser(User user);
    List<Category> findByUserAndType(User user, Category.TransactionType type);
    Optional<Category> findByIdAndUser(Long id, User user);
}
