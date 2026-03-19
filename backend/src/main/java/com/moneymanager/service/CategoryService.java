package com.moneymanager.service;

import com.moneymanager.dto.CategoryDTO;
import com.moneymanager.entity.Category;
import com.moneymanager.entity.User;
import com.moneymanager.exception.ResourceNotFoundException;
import com.moneymanager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryDTO.Response> getUserCategories(User user) {
        return categoryRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryDTO.Response createCategory(CategoryDTO.Request request, User user) {
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .icon(request.getIcon())
                .user(user)
                .build();
        return mapToResponse(categoryRepository.save(category));
    }

    public CategoryDTO.Response updateCategory(Long id, CategoryDTO.Request request, User user) {
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setName(request.getName());
        category.setType(request.getType());
        category.setIcon(request.getIcon());
        return mapToResponse(categoryRepository.save(category));
    }

    public void deleteCategory(Long id, User user) {
        Category category = categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        categoryRepository.delete(category);
    }

    public Category getCategoryEntity(Long id, User user) {
        return categoryRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public void createDefaultCategories(User user) {
        String[][] defaults = {
            {"Salary", "INCOME", "💰"},
            {"Freelance", "INCOME", "💼"},
            {"Investment", "INCOME", "📈"},
            {"Food & Dining", "EXPENSE", "🍔"},
            {"Rent", "EXPENSE", "🏠"},
            {"Transportation", "EXPENSE", "🚗"},
            {"Entertainment", "EXPENSE", "🎬"},
            {"Shopping", "EXPENSE", "🛍️"},
            {"Healthcare", "EXPENSE", "🏥"},
            {"Travel", "EXPENSE", "✈️"},
            {"Utilities", "EXPENSE", "💡"},
            {"Education", "EXPENSE", "📚"}
        };

        for (String[] def : defaults) {
            Category category = Category.builder()
                    .name(def[0])
                    .type(Category.TransactionType.valueOf(def[1]))
                    .icon(def[2])
                    .user(user)
                    .build();
            categoryRepository.save(category);
        }
    }

    private CategoryDTO.Response mapToResponse(Category category) {
        CategoryDTO.Response response = new CategoryDTO.Response();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setType(category.getType());
        response.setIcon(category.getIcon());
        return response;
    }
}
