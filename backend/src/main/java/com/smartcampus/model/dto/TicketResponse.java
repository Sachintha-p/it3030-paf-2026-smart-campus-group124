package com.smartcampus.model.dto;

import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketPriority;
import com.smartcampus.model.enums.TicketStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private Long resourceId;
    private String resourceName;
    private String submittedBy;
    private String assignedTo;
    private TicketCategory category;
    private TicketPriority priority;
    private TicketStatus status;
    private String description;
    private String preferredContactDetails;
    private String imageUrl1;
    private String imageUrl2;
    private String imageUrl3;
    private String resolutionNotes;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}