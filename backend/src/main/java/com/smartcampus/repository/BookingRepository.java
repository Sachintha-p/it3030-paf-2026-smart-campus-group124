package com.smartcampus.repository;

import com.smartcampus.model.entity.Booking;
import com.smartcampus.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUserEmail(String email);

    // THE MAGIC QUERY: Checks if a resource is already booked during the requested time!
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.resource.id = :resourceId " +
           "AND b.date = :date " +
           "AND b.status IN (:statuses) " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsConflictingBooking(@Param("resourceId") Long resourceId,
                                     @Param("date") LocalDate date,
                                     @Param("startTime") LocalTime startTime,
                                     @Param("endTime") LocalTime endTime,
                                     @Param("statuses") List<BookingStatus> statuses);

    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
           "WHERE b.id <> :bookingId " +
           "AND b.resource.id = :resourceId " +
           "AND b.date = :date " +
           "AND b.status IN (:statuses) " +
           "AND (b.startTime < :endTime AND b.endTime > :startTime)")
    boolean existsConflictingBookingExcludingId(@Param("bookingId") Long bookingId,
                                                @Param("resourceId") Long resourceId,
                                                @Param("date") LocalDate date,
                                                @Param("startTime") LocalTime startTime,
                                                @Param("endTime") LocalTime endTime,
                                                @Param("statuses") List<BookingStatus> statuses);
}