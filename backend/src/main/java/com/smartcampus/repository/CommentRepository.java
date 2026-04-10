package com.smartcampus.repository;

import com.smartcampus.model.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Get all comments for a specific ticket, oldest to newest
    List<Comment> findByTicketIdOrderByCreatedAtAsc(Long ticketId);
}