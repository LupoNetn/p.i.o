import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import {
  makeBooking,
  approveBooking,
  deleteBooking,
  getUserBookings,
  getAllBookings,
  getOccupiedSlots,
  getBookingById,
  rescheduleBooking
} from '../controllers/bookingController.js';

const router = Router();

// Make a new booking (user)
router.post('/', authMiddleware, makeBooking);

//get occupied slots for a given date (public)
router.get('/occupied-slots', getOccupiedSlots);

// Approve a booking (producer/admin)
router.patch('/:id/approve', authMiddleware, approveBooking);

//reschedule or update a booking (user)
router.patch('/:id', authMiddleware, rescheduleBooking);

// Delete a booking (user or admin)
router.delete('/:id', authMiddleware, deleteBooking);

// Fetch all bookings made by the currently logged-in user
router.get('/:id/my-bookings', getUserBookings);

// Fetch all bookings (for the producer/admin dashboard)
router.get('/', authMiddleware, getAllBookings);

//fetch a single booking by id
router.get('/:id', getBookingById);

export default router;
