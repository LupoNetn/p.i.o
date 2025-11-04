import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../schemas/bookingSchema";
import type { BookingFormData } from "../schemas/bookingSchema";
import { Button } from "../components/ui/button";
import { CalendarDays, Clock } from "lucide-react";
import useAuthStore from "../stores/useAuthStore";
import api from "../lib/axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import useBookingStore from "../stores/useBookingStore";
import { format, parseISO } from 'date-fns';

const BookingPage = () => {
  const user = useAuthStore((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");

  //  Reschedule state from Zustand
  const rescheduleBookingId = useBookingStore(
    (state: any) => state.rescheduleBookingId
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  //  Fetch existing booking data if rescheduling
  useEffect(() => {
    const fetchBookingData = async () => {
      if (!rescheduleBookingId) return;

      try {
        setLoading(true);
        const res = await api.get(`/booking/${rescheduleBookingId}`, {
          withCredentials: true,
        });
        const booking = res.data.booking;

        if (booking) {
          // Parse date - could be Date object or string
          const dateObj = new Date(booking.date);
          const date = dateObj.toISOString().split("T")[0];
          
          // startTime and endTime are now strings (e.g., "10:00"), not Date objects
          let startTime = booking.startTime;
          let endTime = booking.endTime;
          
          // If they're somehow Date objects or ISO strings, extract time part
          if (typeof startTime === 'object' || startTime.includes('T')) {
            const startDate = new Date(startTime);
            startTime = startDate.toISOString().substring(11, 16); // Extract HH:MM
          }
          
          if (typeof endTime === 'object' || endTime.includes('T')) {
            const endDate = new Date(endTime);
            endTime = endDate.toISOString().substring(11, 16);
          }

          // Prefill form
          setValue("date", date);
          setValue("startTime", startTime);
          setValue("endTime", endTime);
          setValue("notes", booking.notes || "");

          setSelectedDate(date);
          toast.info("Rescheduling booking — fields prefilled for reschedule");
        }
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        toast.error("Unable to load booking for reschedule.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [rescheduleBookingId, setValue]);

  // Fetch occupied slots whenever a date is selected
  useEffect(() => {
    const fetchOccupiedSlots = async () => {
      if (!selectedDate) return;

      try {
        const res = await api.get(
          `/booking/occupied-slots?date=${selectedDate}`
        );
        setOccupiedSlots(res.data.occupiedSlots || []);
      } catch (err) {
        console.error("Failed to fetch occupied slots:", err);
      }
    };
    fetchOccupiedSlots();
  }, [selectedDate]);

  // Submit handler
  const onSubmit = async (data: BookingFormData) => {
    if (!user || !user.id) {
      toast.error("You must be signed in to book a session.");
      return;
    }

    setLoading(true);
    try {
      // Send simple date and time strings - no timezone conversion needed
      // The backend will handle storing them correctly
      const bookingData = {
        userId: user.id,
        date: data.date, // Simple date string like "2025-01-15"
        startTime: data.startTime, // Simple time string like "10:00"
        endTime: data.endTime, // Simple time string like "11:00"
        notes: data.notes || "",
      };

      let res;
      if (rescheduleBookingId) {
        res = await api.patch(`/booking/${rescheduleBookingId}`, bookingData, {
          withCredentials: true,
        });
        toast.success("Booking successfully rescheduled!");
      } else {
        res = await api.post("/booking", bookingData, {
          withCredentials: true,
        });
        if (res.status === 201) {
          toast.success("Your session has been booked!");
        }
      }

      reset();
      setSelectedDate("");
      setOccupiedSlots([]);
    } catch (err: any) {
      console.error("Booking error:", err);
      const message =
        err.response?.data?.message || "An unexpected error occurred.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Update the occupied slots display - startTime and endTime are now strings like "10:00"
  const formatTimeSlot = (timeString: string) => {
    try {
      // If it's already a time string (HH:MM), format it directly
      if (typeof timeString === 'string' && timeString.length <= 5 && timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return format(date, 'h:mm a');
      }
      // Fallback: if it's an ISO string, parse it
      return format(parseISO(timeString), 'h:mm a');
    } catch (err) {
      console.error("Error formatting time slot:", err);
      return timeString;
    }
  };

  return (
    <section className="app-container mt-30 text-gray-100 font-heading">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 border border-border rounded-3xl overflow-hidden shadow-2xl bg-card">
        {/* LEFT COLUMN — Info */}
        <div className="relative bg-gradient-to-br from-accent/10 to-transparent flex flex-col justify-center items-center p-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold text-accent mb-4">
            {rescheduleBookingId
              ? "Reschedule Your Session 🎧"
              : "Book Your Studio Time 🎶"}
          </h2>
          <p className="text-gray-400 max-w-md">
            Choose your session date and time. Occupied slots will be displayed
            below.
          </p>
          <div className="absolute inset-0 bg-[url('/studio.jpg')] bg-cover bg-center opacity-10 pointer-events-none rounded-3xl" />
        </div>

        {/* RIGHT COLUMN — Form */}
        <div className="p-10 bg-card/90 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Date */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Choose Date
              </label>
              <div className="flex items-center border-b border-border focus-within:border-accent transition">
                <CalendarDays className="text-gray-400 mr-2 w-4 h-4" />
                <input
                  {...register("date")}
                  type="date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent w-full p-2 outline-none text-sm text-gray-100"
                />
              </div>
              {errors.date && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Occupied Slots */}
            {selectedDate && (
              <div className="bg-gray-900/40 border border-border rounded-lg p-3 text-sm text-gray-300">
                <p className="text-accent font-semibold mb-2">
                  Occupied Time Slots For The Selected Date:
                </p>
                {occupiedSlots.length > 0 ? (
                  <ul className="space-y-1">
                    {occupiedSlots.map((slot, index) => (
                      <li key={index} className="text-gray-400">
                        {formatTimeSlot(slot.startTime)}{" "}
                        -{" "}
                        {formatTimeSlot(slot.endTime)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">
                    No occupied slots for this date.
                  </p>
                )}
              </div>
            )}

            {/* Times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Start Time
                </label>
                <div className="flex items-center border-b border-border focus-within:border-accent transition">
                  <Clock className="text-gray-400 mr-2 w-4 h-4" />
                  <input
                    {...register("startTime")}
                    type="time"
                    className="bg-transparent w-full p-2 outline-none text-sm text-gray-100"
                  />
                </div>
                {errors.startTime && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  End Time
                </label>
                <div className="flex items-center border-b border-border focus-within:border-accent transition">
                  <Clock className="text-gray-400 mr-2 w-4 h-4" />
                  <input
                    {...register("endTime")}
                    type="time"
                    className="bg-transparent w-full p-2 outline-none text-sm text-gray-100"
                  />
                </div>
                {errors.endTime && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Any special requests?"
                className="bg-transparent border-b border-border w-full p-2 outline-none text-sm text-gray-100 placeholder:text-gray-500 focus:border-accent transition"
              />
            </div>

            {/* Submit */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-accent text-black font-semibold py-4 rounded-xl hover:opacity-90 transition"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : rescheduleBookingId
                    ? "Update Booking"
                    : "Book My Session"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingPage;
