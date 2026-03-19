package com.moneymanager.controller;

import com.moneymanager.dto.CategoryDTO;
import com.moneymanager.entity.User;
import com.moneymanager.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management APIs")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all user categories")
    public ResponseEntity<List<CategoryDTO.Response>> getCategories(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.getUserCategories(user));
    }

    @PostMapping
    @Operation(summary = "Create a category")
    public ResponseEntity<CategoryDTO.Response> create(
            @Valid @RequestBody CategoryDTO.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.createCategory(request, user));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a category")
    public ResponseEntity<CategoryDTO.Response> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO.Request request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request, user));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a category")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        categoryService.deleteCategory(id, user);
        return ResponseEntity.noContent().build();
    }
}
