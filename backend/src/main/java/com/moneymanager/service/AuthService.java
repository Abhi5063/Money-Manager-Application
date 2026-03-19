package com.moneymanager.service;

import com.moneymanager.dto.AuthDTO;
import com.moneymanager.entity.User;
import com.moneymanager.exception.EmailAlreadyExistsException;
import com.moneymanager.repository.UserRepository;
import com.moneymanager.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final CategoryService categoryService;

    public AuthDTO.AuthResponse register(AuthDTO.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already in use: " + request.getEmail());
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .build();

        userRepository.save(user);
        categoryService.createDefaultCategories(user);

        String token = jwtUtil.generateToken(user);
        return new AuthDTO.AuthResponse(token, user.getName(), user.getEmail(), user.getId());
    }

    public AuthDTO.AuthResponse login(AuthDTO.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        String token = jwtUtil.generateToken(user);
        return new AuthDTO.AuthResponse(token, user.getName(), user.getEmail(), user.getId());
    }

    public AuthDTO.UserProfile getProfile(User user) {
        AuthDTO.UserProfile profile = new AuthDTO.UserProfile();
        profile.setId(user.getId());
        profile.setName(user.getName());
        profile.setEmail(user.getEmail());
        profile.setRole(user.getRole().name());
        return profile;
    }
}
