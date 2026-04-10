package com.smartcampus.service;

import com.smartcampus.model.dto.CommentRequest;
import com.smartcampus.model.dto.CommentResponse;
import com.smartcampus.model.dto.TicketRequest;
import com.smartcampus.model.dto.TicketResponse;
import com.smartcampus.model.enums.TicketStatus;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface TicketService {
    List<TicketResponse> getMyTickets(String email);
    List<TicketResponse> getAllTickets();
    TicketResponse getTicketById(Long id);
    TicketResponse createTicket(TicketRequest request, String email);
    
    // THE FIX: This line now exactly matches your Impl file (includes assignedToEmail)
    TicketResponse updateTicketStatus(Long id, TicketStatus status, String resolutionNotes, String rejectionReason, String assignedToEmail);
    
    // Comment functionality
    CommentResponse addComment(Long ticketId, CommentRequest request, String emailOrId);
    List<CommentResponse> getTicketComments(Long ticketId);
    
    // Image upload functionality
    TicketResponse uploadImages(Long ticketId, List<MultipartFile> files);
}