package com.smartcampus.service;

import com.smartcampus.model.dto.UserResponse;
import com.smartcampus.model.enums.Role;

import java.util.List;

public interface UserService {
    UserResponse getCurrentUser(String email);
    List<UserResponse> getAllUsers();
    UserResponse changeUserRole(Long id, Role role);
    void deleteUser(Long id);
}