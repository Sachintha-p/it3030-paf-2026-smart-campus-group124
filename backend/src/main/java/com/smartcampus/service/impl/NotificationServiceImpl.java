package com.smartcampus.service.impl;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.dto.NotificationResponse;
import com.smartcampus.model.entity.Notification;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.repository.NotificationRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Override
    public void createNotification(User recipient, NotificationType type, String message, Long relatedEntityId, String relatedEntityType) {
        Notification notification = Notification.builder()
                .recipient(recipient)
                .type(type)
                .message(message)
                .isRead(false)
                .relatedEntityId(relatedEntityId)
                .relatedEntityType(relatedEntityType)
                .build();
        notificationRepository.save(notification);
    }

    @Override
    public List<NotificationResponse> getMyNotifications(String emailOrId) {
        // Ghost User Fix
        User user = userRepository.findByProviderId(emailOrId)
                .orElseGet(() -> userRepository.findByEmail(emailOrId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(user.getEmail()).stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .recipientId(n.getRecipient().getId()) // THE FIX: Added this line to match your new DTO!
                        .type(n.getType())
                        .message(n.getMessage())
                        .isRead(n.getIsRead())
                        .relatedEntityId(n.getRelatedEntityId())
                        .relatedEntityType(n.getRelatedEntityType())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id).orElseThrow();
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(String emailOrId) {
        User user = userRepository.findByProviderId(emailOrId)
                .orElseGet(() -> userRepository.findByEmail(emailOrId)
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        List<Notification> unread = notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(user.getEmail())
                .stream().filter(n -> !n.getIsRead()).collect(Collectors.toList());

        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }
}