package com.moneymanager.service;

import com.moneymanager.dto.TransactionDTO;
import com.moneymanager.entity.Category;
import com.moneymanager.entity.Transaction;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryService categoryService;

    public List<TransactionDTO.Response> getTransactions(User user, LocalDate from, LocalDate to, Long categoryId) {
        List<Transaction> transactions;
        if (from != null && to != null) {
            transactions = transactionRepository.findByUserAndDateBetweenOrderByDateDesc(user, from, to);
        } else if (categoryId != null) {
            Category category = categoryService.getCategoryEntity(categoryId, user);
            transactions = transactionRepository.findByUserAndCategoryOrderByDateDesc(user, category);
        } else {
            transactions = transactionRepository.findByUserOrderByDateDesc(user);
        }
        return transactions.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TransactionDTO.Response createTransaction(TransactionDTO.Request request, User user) {
        Category category = categoryService.getCategoryEntity(request.getCategoryId(), user);
        Transaction transaction = Transaction.builder()
                .amount(request.getAmount())
                .type(request.getType())
                .category(category)
                .description(request.getDescription())
                .date(request.getDate())
                .user(user)
                .build();
        return mapToResponse(transactionRepository.save(transaction));
    }

    public TransactionDTO.Response updateTransaction(Long id, TransactionDTO.Request request, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        Category category = categoryService.getCategoryEntity(request.getCategoryId(), user);
        transaction.setAmount(request.getAmount());
        transaction.setType(request.getType());
        transaction.setCategory(category);
        transaction.setDescription(request.getDescription());
        transaction.setDate(request.getDate());
        return mapToResponse(transactionRepository.save(transaction));
    }

    public void deleteTransaction(Long id, User user) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    public TransactionDTO.Response mapToResponse(Transaction t) {
        TransactionDTO.Response response = new TransactionDTO.Response();
        response.setId(t.getId());
        response.setAmount(t.getAmount());
        response.setType(t.getType());
        response.setCategoryId(t.getCategory().getId());
        response.setCategoryName(t.getCategory().getName());
        response.setCategoryIcon(t.getCategory().getIcon());
        response.setDescription(t.getDescription());
        response.setDate(t.getDate());
        response.setCreatedAt(t.getCreatedAt().toString());
        return response;
    }
}
