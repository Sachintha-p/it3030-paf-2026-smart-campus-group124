package com.smartcampus.repository;

import com.smartcampus.model.entity.Ticket;
import com.smartcampus.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    
    // Changed from reportedById to userId to match our Ticket.java entity
    List<Ticket> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Ticket> findByAssignedToIdOrderByCreatedAtDesc(Long assignedToId);
    
    List<Ticket> findByStatus(TicketStatus status);

    // We need this one so we can easily fetch tickets using the logged-in user's email!
    List<Ticket> findByUserEmailOrderByCreatedAtDesc(String email);
}