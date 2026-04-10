package com.smartcampus.service;

import com.smartcampus.model.dto.BookingRequest;
import com.smartcampus.model.dto.BookingResponse;

import java.util.List;

public interface BookingService {
    List<BookingResponse> getMyBookings(String email);
    List<BookingResponse> getAllBookings();
    BookingResponse getBookingById(Long id);
    BookingResponse createBooking(BookingRequest request, String email);
    BookingResponse updateBooking(Long id, BookingRequest request, String email);
    void deleteBooking(Long id, String email);
    BookingResponse approveBooking(Long id);
    BookingResponse rejectBooking(Long id, String reason);
    BookingResponse cancelBooking(Long id, String email);
}
