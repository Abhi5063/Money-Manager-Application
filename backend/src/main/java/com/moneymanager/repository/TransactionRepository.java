package com.moneymanager.repository;

import com.moneymanager.entity.Category;
import com.moneymanager.entity.Transaction;
import com.moneymanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByDateDesc(User user);

    List<Transaction> findByUserAndDateBetweenOrderByDateDesc(User user, LocalDate start, LocalDate end);

    List<Transaction> findByUserAndTypeOrderByDateDesc(User user, Category.TransactionType type);

    List<Transaction> findByUserAndCategoryOrderByDateDesc(User user, Category category);

    Optional<Transaction> findByIdAndUser(Long id, User user);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type")
    BigDecimal sumByUserAndType(@Param("user") User user, @Param("type") Category.TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = :type AND t.date BETWEEN :start AND :end")
    BigDecimal sumByUserAndTypeAndDateBetween(@Param("user") User user,
                                              @Param("type") Category.TransactionType type,
                                              @Param("start") LocalDate start,
                                              @Param("end") LocalDate end);

    @Query("SELECT t.category.name, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.date BETWEEN :start AND :end GROUP BY t.category.name")
    List<Object[]> sumByCategory(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT MONTH(t.date), YEAR(t.date), t.type, COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.date BETWEEN :start AND :end GROUP BY MONTH(t.date), YEAR(t.date), t.type ORDER BY YEAR(t.date), MONTH(t.date)")
    List<Object[]> monthlyBreakdown(@Param("user") User user, @Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.user = :user AND t.type = 'EXPENSE' AND t.category = :category AND t.date BETWEEN :start AND :end")
    BigDecimal sumExpenseByCategoryAndDateBetween(@Param("user") User user,
                                                  @Param("category") Category category,
                                                  @Param("start") LocalDate start,
                                                  @Param("end") LocalDate end);

    List<Transaction> findTop5ByUserOrderByCreatedAtDesc(User user);
}
