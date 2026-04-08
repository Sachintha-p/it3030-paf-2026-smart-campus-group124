package com.smartcampus.controller;

import com.smartcampus.model.dto.ApiResponse;
import com.smartcampus.model.dto.BookingRequest;
import com.smartcampus.model.dto.BookingResponse;
import com.smartcampus.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // Create a new booking
    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(@Valid @RequestBody BookingRequest request, Principal principal) {
        BookingResponse response = bookingService.createBooking(request, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", response));
    }

    // Get my bookings
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(Principal principal) {
        List<BookingResponse> responses = bookingService.getMyBookings(principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Fetched your bookings", responses));
    }

    // Get ALL bookings (Admin Dashboard)
    @GetMapping
    // @PreAuthorize("hasAuthority('ROLE_ADMIN') || hasAuthority('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings() {
        List<BookingResponse> responses = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("Fetched all bookings", responses));
    }

    // APPROVE a booking
    @PutMapping("/{id}/approve")
    // @PreAuthorize("hasAuthority('ROLE_ADMIN') || hasAuthority('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<ApiResponse<BookingResponse>> approveBooking(@PathVariable Long id) {
        BookingResponse response = bookingService.approveBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking approved", response));
    }

    // REJECT a booking
    @PutMapping("/{id}/reject")
    // @PreAuthorize("hasAuthority('ROLE_ADMIN') || hasAuthority('ADMIN')") // Temporarily disabled for testing
    public ResponseEntity<ApiResponse<BookingResponse>> rejectBooking(
            @PathVariable Long id, 
            @RequestParam(required = false, defaultValue = "No reason provided") String reason) {
        BookingResponse response = bookingService.rejectBooking(id, reason);
        return ResponseEntity.ok(ApiResponse.success("Booking rejected", response));
    }

    // CANCEL a booking (User action)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(@PathVariable Long id, Principal principal) {
        BookingResponse response = bookingService.cancelBooking(id, principal.getName());
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled", response));
    }
}