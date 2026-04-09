package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.UserResponse;
import com.smartcampus.model.enums.Role;
import com.smartcampus.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    // THE FIX: Added this so the Admin Dashboard can fetch the user list!
    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    // THE FIX: Added this so the Admin Dashboard can change a user's role!
    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> changeUserRole(@PathVariable Long id, @RequestParam Role role) {
        return ResponseEntity.ok(ApiResponse.success(userService.changeUserRole(id, role)));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Not authenticated"));
        }

        // Use the email attribute because Google's principal name is a numeric ID
        String email = principal.getAttribute("email");
        log.info("Requesting profile for email: {}", email);

        UserResponse user = userService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User successfully deleted."));
    }
}