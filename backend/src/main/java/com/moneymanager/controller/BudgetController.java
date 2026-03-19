package com.moneymanager.controller;

import com.moneymanager.dto.BudgetDTO;
import com.moneymanager.entity.User;
import com.moneymanager.service.BudgetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@Tag(name = "Budgets", description = "Budget management APIs")
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    @Operation(summary = "Get budgets for a given month/year (defaults to current month)")
    public ResponseEntity<List<BudgetDTO.Response>> getBudgets(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(budgetService.getBudgets(user, month, year));
    }

    @PostMapping
    @Operation(summary = "Set a budget for a category")
    public ResponseEntity<BudgetDTO.Response> create(
            @Valid @RequestBody BudgetDTO.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(budgetService.createBudget(request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a budget limit")
    public ResponseEntity<BudgetDTO.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody BudgetDTO.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(budgetService.updateBudget(id, request, user));
    }
}
