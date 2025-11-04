import prisma from "../config/db.js";
import { BookingStatus } from "@prisma/client";
import { DateTime } from "luxon"; 

// Helper function to normalize booking data - converts DateTime startTime/endTime to "HH:MM" strings
const normalizeBooking = (booking) => {
  if (!booking) return booking;
  
  const normalized = { ...booking };
  
  // Convert startTime to string format "HH:MM"
  if (normalized.startTime) {
    if (normalized.startTime instanceof Date) {
      // If it's a Date object, extract HH:MM
      const hours = String(normalized.startTime.getUTCHours()).padStart(2, '0');
      const minutes = String(normalized.startTime.getUTCMinutes()).padStart(2, '0');
      normalized.startTime = `${hours}:${minutes}`;
    } else if (typeof normalized.startTime === 'string' && normalized.startTime.includes('T')) {
      // If it's an ISO string, extract HH:MM
      const date = new Date(normalized.startTime);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      normalized.startTime = `${hours}:${minutes}`;
    }
    // Otherwise it's already a string like "10:00", keep it as is
  }
  
  // Convert endTime to string format "HH:MM"
  if (normalized.endTime) {
    if (normalized.endTime instanceof Date) {
      const hours = String(normalized.endTime.getUTCHours()).padStart(2, '0');
      const minutes = String(normalized.endTime.getUTCMinutes()).padStart(2, '0');
      normalized.endTime = `${hours}:${minutes}`;
    } else if (typeof normalized.endTime === 'string' && normalized.endTime.includes('T')) {
      const date = new Date(normalized.endTime);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      normalized.endTime = `${hours}:${minutes}`;
    }
  }
  
  return normalized;
};

// Helper to normalize arrays of bookings
const normalizeBookings = (bookings) => {
  if (!Array.isArray(bookings)) return bookings;
  return bookings.map(normalizeBooking);
};

//  Make a booking
export const makeBooking = async (req, res) => {
  const { date, startTime, endTime, notes } = req.body;
  const userId = req.user.id;

  if (!date || !startTime || !endTime) {
    return res.status(400).json({
      message: 'All input fields are required!'
    })
  }

  try {
    // Parse incoming date - could be ISO string or date string
    let dateStr = date;
    if (date.includes('T')) {
      // If it's an ISO string, extract just the date part
      dateStr = date.split('T')[0];
    }
    
    // Parse incoming times - could be ISO string or time string (HH:MM)
    let startTimeStr = startTime;
    let endTimeStr = endTime;
    
    if (startTime.includes('T') || startTime.includes(':')) {
      // If it's an ISO string, extract time part (HH:MM)
      if (startTime.includes('T')) {
        startTimeStr = startTime.split('T')[1].substring(0, 5); // Extract HH:MM
      } else if (startTime.length > 5) {
        // If it's a longer time string, take first 5 chars
        startTimeStr = startTime.substring(0, 5);
      }
    }
    
    if (endTime.includes('T') || endTime.includes(':')) {
      if (endTime.includes('T')) {
        endTimeStr = endTime.split('T')[1].substring(0, 5);
      } else if (endTime.length > 5) {
        endTimeStr = endTime.substring(0, 5);
      }
    }

    // 1. Prepare for overlap check using the date and time strings
    // Create full ISO strings interpreted as UTC for comparison
    const startISO = `${dateStr}T${startTimeStr}:00.000Z`;
    const endISO = `${dateStr}T${endTimeStr}:00.000Z`;

    const startMoment = new Date(startISO);
    const endMoment = new Date(endISO);
    
    // For the date field, ensure it's a clean date (midnight UTC)
    const bookingDate = new Date(dateStr);
    bookingDate.setUTCHours(0, 0, 0, 0);

    // 2. Check for overlapping bookings
    const overlappingBookings = await prisma.booking.findMany({
      where: {
        date: bookingDate,
        status: { notIn: ["CANCELLED", "COMPLETED"] },
      },
    });
    
    const hasOverlap = overlappingBookings.some((booking) => {
      // Handle both Date objects (old bookings) and strings (new bookings)
      let existingStartTime, existingEndTime;
      
      if (booking.startTime instanceof Date) {
        // Old booking with DateTime - use the date as-is
        existingStartTime = booking.startTime;
      } else {
        // New booking with string time - reconstruct date
        const timeStr = typeof booking.startTime === 'string' && booking.startTime.includes('T') 
          ? booking.startTime.split('T')[1].substring(0, 5)
          : booking.startTime;
        existingStartTime = new Date(`${dateStr}T${timeStr}:00.000Z`);
      }
      
      if (booking.endTime instanceof Date) {
        existingEndTime = booking.endTime;
      } else {
        const timeStr = typeof booking.endTime === 'string' && booking.endTime.includes('T')
          ? booking.endTime.split('T')[1].substring(0, 5)
          : booking.endTime;
        existingEndTime = new Date(`${dateStr}T${timeStr}:00.000Z`);
      }
      
      // Overlap logic using the UTC moments:
      return startMoment < existingEndTime && endMoment > existingStartTime;
    });

    if (hasOverlap) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked. Please choose a different time.'
      });
    }
    
    // 3. Create the booking
    const newBooking = await prisma.booking.create({
      data: {
        userId,
        date: bookingDate,
        startTime: startTimeStr, // Storing as string "10:00"
        endTime: endTimeStr,   // Storing as string "11:00"
        notes,
        status: BookingStatus.PENDING,
      },
    });
    res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      booking: normalizeBooking(newBooking),
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating booking.'
    });
  }
};



//reschedule or update a booking
export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, notes } = req.body;
    const userId = req.user.id;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide date, start time, and end time.",
      });
    }

    // Parse incoming date - could be ISO string or date string
    let dateStr = date;
    if (date.includes('T')) {
      dateStr = date.split('T')[0];
    }
    
    // Parse incoming times - extract time part if ISO string
    let startTimeStr = startTime;
    let endTimeStr = endTime;
    
    if (startTime.includes('T')) {
      startTimeStr = startTime.split('T')[1].substring(0, 5); // Extract HH:MM
    } else if (startTime.length > 5) {
      startTimeStr = startTime.substring(0, 5);
    }
    
    if (endTime.includes('T')) {
      endTimeStr = endTime.split('T')[1].substring(0, 5);
    } else if (endTime.length > 5) {
      endTimeStr = endTime.substring(0, 5);
    }

    // Create Date object for the booking date (midnight UTC)
    const bookingDate = new Date(dateStr);
    bookingDate.setUTCHours(0, 0, 0, 0);

    // Step 1: Verify booking exists & belongs to user (or admin)
    const existingBooking = await prisma.booking.findUnique({ where: { id } });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (existingBooking.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to modify this booking.",
      });
    }

    // Step 2: Query bookings for the same date excluding current one
    const sameDayBookings = await prisma.booking.findMany({
      where: {
        date: bookingDate,
        id: { not: id },
        status: { notIn: ["CANCELLED", "COMPLETED"] },
      },
    });

    // Step 3: Check overlap using string times
    const startISO = `${dateStr}T${startTimeStr}:00.000Z`;
    const endISO = `${dateStr}T${endTimeStr}:00.000Z`;
    const startMoment = new Date(startISO);
    const endMoment = new Date(endISO);

    const hasOverlap = sameDayBookings.some((b) => {
      // Handle both Date objects (old bookings) and strings (new bookings)
      let existingStartTime, existingEndTime;
      
      if (b.startTime instanceof Date) {
        existingStartTime = b.startTime;
      } else {
        const timeStr = typeof b.startTime === 'string' && b.startTime.includes('T') 
          ? b.startTime.split('T')[1].substring(0, 5)
          : b.startTime;
        existingStartTime = new Date(`${dateStr}T${timeStr}:00.000Z`);
      }
      
      if (b.endTime instanceof Date) {
        existingEndTime = b.endTime;
      } else {
        const timeStr = typeof b.endTime === 'string' && b.endTime.includes('T')
          ? b.endTime.split('T')[1].substring(0, 5)
          : b.endTime;
        existingEndTime = new Date(`${dateStr}T${timeStr}:00.000Z`);
      }
      
      return startMoment < existingEndTime && endMoment > existingStartTime;
    });

    if (hasOverlap) {
      return res.status(409).json({
        success: false,
        message:
          "This time slot overlaps with another booking. Please select a different time.",
      });
    }

    // Step 4: Update the booking with string times
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        date: bookingDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        notes,
        status: BookingStatus.RESCHEDULED,
      },
    });

    res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully.",
      booking: normalizeBooking(updatedBooking),
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating booking.",
    });
  }
};

//get occupied slots for a given date
export const getOccupiedSlots = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Please provide a date.",
    });
  }

  try {
    // Parse date - could be ISO string or date string
    let dateStr = date;
    if (date.includes('T')) {
      dateStr = date.split('T')[0];
    }
    
    const bookingDate = new Date(dateStr);
    bookingDate.setUTCHours(0, 0, 0, 0);
    
    const bookings = await prisma.booking.findMany({
      where: {
        date: bookingDate,
        status: { notIn: ["CANCELLED", "COMPLETED"] },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    // Normalize occupied slots - convert times to strings if needed
    const normalizedSlots = bookings.map(slot => ({
      startTime: normalizeBooking({ startTime: slot.startTime }).startTime,
      endTime: normalizeBooking({ endTime: slot.endTime }).endTime,
    }));
    
    res.status(200).json({
      success: true,
      occupiedSlots: normalizedSlots,
    });
  } catch (error) {
    console.error("Error fetching occupied slots:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching occupied slots.",
    });
  }
};

//get a single booking by id
export const getBookingById = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }
    res.status(200).json({
      success: true,
      booking: normalizeBooking(booking),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching booking.",
    });
  }
};

//  Approve a booking (for producer/admin)
export const approveBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const approvedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: BookingStatus.CONFIRMED,
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully confirmed booking.",
      booking: normalizeBooking(approvedBooking),
    });
  } catch (error) {
    console.error("Error approving booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while approving booking.",
    });
  }
};

//  Delete a booking
export const deleteBooking = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const booking = await prisma.booking.findUnique({ where: { id } });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Allow only the booking owner or admin to delete
    if (booking.userId !== userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this booking.",
      });
    }

    await prisma.booking.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting booking.",
    });
  }
};

//  Get all bookings made by the logged-in user
export const getUserBookings = async (req, res) => {
  const userId = req.params.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const normalizedBookings = normalizeBookings(bookings);
    console.log("User bookings fetched:", normalizedBookings);

    res.status(200).json({
      success: true,
      count: normalizedBookings.length,
      bookings: normalizedBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching bookings.",
    });
  }
};

//  Get all bookings (for producer/admin dashboard)
export const getAllBookings = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. Only producers/admins can view all bookings.",
      });
    }

    // 🧠 Update old bookings to COMPLETED if their date is in the past
    await prisma.booking.updateMany({
      where: {
        date: { lt: new Date() },
        status: { not: BookingStatus.COMPLETED },
      },
      data: { status: BookingStatus.COMPLETED },
    });

    // 🗂 Fetch all bookings (with user info)
    const bookings = await prisma.booking.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const normalizedBookings = normalizeBookings(bookings);
    
    res.status(200).json({
      success: true,
      count: normalizedBookings.length,
      bookings: normalizedBookings,
    });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching all bookings.",
    });
  }
};
