package com.smartcampus.repository;

import com.smartcampus.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // THE FIX: Added this so Spring Boot can find you by your Google ID!
    Optional<User> findByProviderId(String providerId);
}