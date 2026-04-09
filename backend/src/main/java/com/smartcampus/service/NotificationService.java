package com.smartcampus.service;

import com.smartcampus.model.dto.NotificationResponse;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.NotificationType;

import java.util.List;

public interface NotificationService {
    // Updated to accept your new fields!
    void createNotification(User recipient, NotificationType type, String message, Long relatedEntityId, String relatedEntityType);
    List<NotificationResponse> getMyNotifications(String emailOrId);
    void markAsRead(Long id);
    void markAllAsRead(String emailOrId);
}