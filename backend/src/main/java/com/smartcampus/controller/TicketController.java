package com.smartcampus.controller;

import com.smartcampus.model.dto.*;
import com.smartcampus.model.enums.TicketStatus;
import com.smartcampus.service.TicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class TicketController {

    private final TicketService ticketService;

    // Fetch user's own tickets
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getMyTickets(authentication.getName())));
    }

    // Fetch all tickets (For staff/admin)
    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAllTickets() {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getAllTickets()));
    }

    // Fetch single ticket details
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketById(id)));
    }

    // Create a new ticket
    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(@Valid @RequestBody TicketRequest request, Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.createTicket(request, authentication.getName())));
    }

    // Upload images to an existing ticket
    @PostMapping("/{id}/images")
    public ResponseEntity<ApiResponse<TicketResponse>> uploadImages(
            @PathVariable Long id, 
            @RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.uploadImages(id, files)));
    }

    // Update ticket workflow status
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> payload) {
        
        TicketStatus status = TicketStatus.valueOf(payload.get("status"));
        String resolutionNotes = payload.get("resolutionNotes");
        String rejectionReason = payload.get("rejectionReason");
        
        // Grab the assigned email from the frontend payload
        String assignedToEmail = payload.get("assignedToEmail");
        
        // PASSING ALL 5 ARGUMENTS HERE!
        return ResponseEntity.ok(ApiResponse.success(ticketService.updateTicketStatus(id, status, resolutionNotes, rejectionReason, assignedToEmail)));
    }

    // Add a comment
    @PostMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<CommentResponse>> addComment(
            @PathVariable Long id, 
            @Valid @RequestBody CommentRequest request, 
            Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.addComment(id, request, authentication.getName())));
    }

    // Get all comments for a ticket
    @GetMapping("/{id}/comments")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(ticketService.getTicketComments(id)));
    }
}