package com.smartcampus.model.dto;

import com.smartcampus.model.enums.TicketCategory;
import com.smartcampus.model.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TicketRequest {

    @NotNull(message = "Resource ID is required")
    private Long resourceId;

    //  Now using the Enum instead of String
    @NotNull(message = "Category is required")
    private TicketCategory category;

    // Now using the Enum instead of String
    @NotNull(message = "Priority is required")
    private TicketPriority priority;

    @NotBlank(message = "Description is required")
    private String description;


    private String preferredContactDetails;
}