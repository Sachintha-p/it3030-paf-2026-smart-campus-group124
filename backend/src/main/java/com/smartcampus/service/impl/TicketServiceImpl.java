package com.smartcampus.service.impl;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.dto.*;
import com.smartcampus.model.entity.Comment;
import com.smartcampus.model.entity.Resource;
import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.repository.CommentRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.TicketRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.NotificationService;
import com.smartcampus.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService; // Added NotificationService

    @Override
    public List<TicketResponse> getMyTickets(String email) {
        return ticketRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll().stream()
                .map(this::mapToTicketResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponse getTicketById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        return mapToTicketResponse(ticket);
    }

    @Override
    public TicketResponse createTicket(TicketRequest request, String emailOrId) {
        
        // THE FIX: Look up the user by Provider ID first (Ghost User Fix)
        User user = userRepository.findByProviderId(emailOrId)
                .orElseGet(() -> userRepository.findByEmail(emailOrId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));
                
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        Ticket ticket = new Ticket();
        ticket.setUser(user);
        ticket.setResource(resource);
        ticket.setCategory(request.getCategory());
        ticket.setPriority(request.getPriority());
        ticket.setDescription(request.getDescription());
        ticket.setPreferredContactDetails(request.getPreferredContactDetails());
        ticket.setStatus(TicketStatus.OPEN); // Default status

        return mapToTicketResponse(ticketRepository.save(ticket));
    }

    @Override
    public TicketResponse updateTicketStatus(Long id, TicketStatus status, String resolutionNotes, String rejectionReason, String assignedToEmail) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        ticket.setStatus(status);
        if (resolutionNotes != null) ticket.setResolutionNotes(resolutionNotes);
        if (rejectionReason != null) ticket.setRejectionReason(rejectionReason);

        // NEW: Assign the technician if an email is provided
        if (assignedToEmail != null && !assignedToEmail.trim().isEmpty()) {
            User staff = userRepository.findByEmail(assignedToEmail).orElse(null);
            if (staff != null) {
                ticket.setAssignedTo(staff);
            }
        }

        // Trigger Status Update Notification
        notificationService.createNotification(ticket.getUser(), NotificationType.TICKET_STATUS_UPDATED, "Your ticket #" + ticket.getId() + " status was updated to " + status + ".", ticket.getId(), "TICKET");

        return mapToTicketResponse(ticketRepository.save(ticket));
    }

    @Override
    public CommentResponse addComment(Long ticketId, CommentRequest request, String emailOrId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
        
        // THE FIX: Search by the Google Provider ID instead of the email!
        User author = userRepository.findByProviderId(emailOrId)
                // Fallback just in case some tokens use email
                .orElseGet(() -> userRepository.findByEmail(emailOrId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for ID/Email: " + emailOrId)));

        Comment comment = new Comment();
        comment.setTicket(ticket);
        comment.setAuthor(author);
        comment.setContent(request.getContent());

        // Trigger Comment Notification (Only if the author isn't the ticket creator)
        if (!ticket.getUser().getId().equals(author.getId())) {
            notificationService.createNotification(ticket.getUser(), NotificationType.NEW_COMMENT, author.getName() + " replied to your ticket #" + ticket.getId(), ticket.getId(), "TICKET");
        }

        return mapToCommentResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getTicketComments(Long ticketId) {
        return commentRepository.findByTicketIdOrderByCreatedAtAsc(ticketId).stream()
                .map(this::mapToCommentResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TicketResponse uploadImages(Long ticketId, List<MultipartFile> files) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        try {
            // Save files to a local 'uploads' folder
            String uploadDir = "uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            for (int i = 0; i < files.size() && i < 3; i++) {
                MultipartFile file = files.get(i);
                if (!file.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                    Path filePath = Paths.get(uploadDir + fileName);
                    Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                    
                    String fileUrl = "/uploads/" + fileName;
                    
                    // Assign to the first available image slot
                    if (ticket.getImageUrl1() == null) ticket.setImageUrl1(fileUrl);
                    else if (ticket.getImageUrl2() == null) ticket.setImageUrl2(fileUrl);
                    else if (ticket.getImageUrl3() == null) ticket.setImageUrl3(fileUrl);
                }
            }
            return mapToTicketResponse(ticketRepository.save(ticket));
        } catch (IOException e) {
            throw new RuntimeException("Failed to store images", e);
        }
    }

    // --- MAPPERS ---
    private TicketResponse mapToTicketResponse(Ticket ticket) {
        return TicketResponse.builder()
                .id(ticket.getId())
                .resourceId(ticket.getResource().getId())
                .resourceName(ticket.getResource().getName())
                .submittedBy(ticket.getUser().getName())
                .assignedTo(ticket.getAssignedTo() != null ? ticket.getAssignedTo().getName() : "Unassigned")
                .category(ticket.getCategory())
                .priority(ticket.getPriority())
                .status(ticket.getStatus())
                .description(ticket.getDescription())
                .preferredContactDetails(ticket.getPreferredContactDetails())
                .imageUrl1(ticket.getImageUrl1())
                .imageUrl2(ticket.getImageUrl2())
                .imageUrl3(ticket.getImageUrl3())
                .resolutionNotes(ticket.getResolutionNotes())
                .rejectionReason(ticket.getRejectionReason())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    private CommentResponse mapToCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicket().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}