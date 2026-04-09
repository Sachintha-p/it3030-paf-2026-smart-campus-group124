package com.smartcampus.service.impl;

import com.smartcampus.exception.ResourceNotFoundException;
import com.smartcampus.model.dto.BookingRequest;
import com.smartcampus.model.dto.BookingResponse;
import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.entity.Resource;
import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.BookingStatus;
import com.smartcampus.model.enums.NotificationType;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.repository.ResourceRepository;
import com.smartcampus.repository.UserRepository;
import com.smartcampus.service.BookingService;
import com.smartcampus.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final NotificationService notificationService; // Added NotificationService

    @Override
    public List<BookingResponse> getMyBookings(String emailOrId) {
        // FIX: Find the user by Provider ID first to handle Google Logins
        User user = userRepository.findByProviderId(emailOrId)
                .orElseGet(() -> userRepository.findByEmail(emailOrId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        // Now that we found the user, use their actual database email to get their bookings
        return bookingRepository.findByUserEmail(user.getEmail()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        return mapToResponse(booking);
    }

    @Override
    public BookingResponse createBooking(BookingRequest request, String emailOrId) {
        // 1. Check for Scheduling Conflicts!
        boolean isConflict = bookingRepository.existsConflictingBooking(
                request.getResourceId(),
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                List.of(BookingStatus.APPROVED, BookingStatus.PENDING) // Blocks overlapping APPROVED or PENDING bookings
        );

        if (isConflict) {
            throw new RuntimeException("Scheduling Conflict: This resource is already booked for the selected time.");
        }

        // FIX: Look up the user by Provider ID first!
        User user = userRepository.findByProviderId(emailOrId)
                .orElseGet(() -> userRepository.findByEmail(emailOrId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found")));

        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        // 2. Prevent booking OUT_OF_SERVICE resources
        if (resource.getStatus() != null && resource.getStatus().equals("OUT_OF_SERVICE")) {
            throw new RuntimeException("This resource is currently out of service.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setResource(resource);
        booking.setDate(request.getDate());
        booking.setStartTime(request.getStartTime());
        booking.setEndTime(request.getEndTime());
        booking.setPurpose(request.getPurpose());
        booking.setExpectedAttendees(request.getExpectedAttendees()); 
        booking.setStatus(BookingStatus.PENDING);

        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.APPROVED);
        
        // Trigger Approval Notification
        notificationService.createNotification(booking.getUser(), NotificationType.BOOKING_APPROVED, "Your booking for " + booking.getResource().getName() + " has been APPROVED.", booking.getId(), "BOOKING");
        
        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse rejectBooking(Long id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason); 
        
        // Trigger Rejection Notification
        notificationService.createNotification(booking.getUser(), NotificationType.BOOKING_REJECTED, "Your booking for " + booking.getResource().getName() + " was REJECTED. Reason: " + reason, booking.getId(), "BOOKING");
        
        return mapToResponse(bookingRepository.save(booking));
    }

    @Override
    public BookingResponse cancelBooking(Long id, String emailOrId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));
        booking.setStatus(BookingStatus.CANCELLED);
        return mapToResponse(bookingRepository.save(booking));
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .resourceId(booking.getResource().getId())
                .resourceName(booking.getResource().getName())
                .userId(booking.getUser().getId())
                .userName(booking.getUser().getName())
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .expectedAttendees(booking.getExpectedAttendees()) 
                .rejectionReason(booking.getRejectionReason())     
                .status(booking.getStatus())
                .build();
    }
}