// ✅ Same imports...
import useAuthStore from "../../stores/useAuthStore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import Spinner from "../../components/Spinner";
import useBookingStore from "../../stores/useBookingStore";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { isAfter, differenceInDays, format } from "date-fns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

const UserDashboard = () => {
  const user = useAuthStore((state: any) => state.user);
  const id = user?.id;
  const fetchMyBookings = useBookingStore(
    (state: any) => state.fetchMyBookings
  );
  const loading = useBookingStore((state: any) => state.loading);
  const setRescheduleBookingId = useBookingStore(
    (state: any) => state.setRescheduleBookingId
  );
  const deleteBooking = useBookingStore((state: any) => state.deleteBooking);

  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      try {
        const data = await fetchMyBookings(id);
        console.log("Fetched bookings data:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("First booking sample:", {
            id: data[0].id,
            date: data[0].date,
            startTime: data[0].startTime,
            endTime: data[0].endTime,
            dateType: typeof data[0].date,
            startTimeType: typeof data[0].startTime,
            endTimeType: typeof data[0].endTime,
          });
        }
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      }
    };
    fetchBooking();
  }, [id, fetchMyBookings]);

  const filteredBookings = bookings
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((booking) =>
      filter === "All"
        ? true
        : booking.status?.toLowerCase() === filter.toLowerCase()
    );

  const totalBookings = bookings.length;
  const recentBookings = bookings.filter((booking) => {
    const date = new Date(booking.date);
    return differenceInDays(new Date(), date) <= 7;
  }).length;

  const upcomingBookings = bookings.filter((booking) => {
    const date = new Date(booking.date);
    return isAfter(date, new Date());
  }).length;

  const bookingsWithinNext3Days = bookings.filter((booking) => {
    const date = new Date(booking.date);
    const daysDiff = differenceInDays(date, new Date());
    return daysDiff >= 0 && daysDiff <= 3;
  })

  const pendingBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

  const handleReschedule = (id: string) => {
    setRescheduleBookingId(id);
    navigate("/booking");
  };

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setCancelDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;

    setIsCancelling(true);
    try {
      await deleteBooking(bookingToCancel);
      toast.success("Booking cancelled successfully.");

      // Refresh bookings list
      if (id) {
        const data = await fetchMyBookings(id);
        setBookings(Array.isArray(data) ? data : []);
      }

      setCancelDialogOpen(false);
      setBookingToCancel(null);
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to cancel booking. Please try again."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCloseCancelDialog = () => {
    if (!isCancelling) {
      setCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  // Helper function to format just the time (HH:MM to h:mm a)
  const formatTime = (timeInput: any) => {
    try {
      if (
        !timeInput ||
        timeInput === null ||
        timeInput === undefined ||
        timeInput === ""
      ) {
        return "";
      }

      let timeStr = String(timeInput).trim();

      // Handle if timeInput is a Date object or ISO string
      if (
        timeInput instanceof Date ||
        (typeof timeInput === "string" && timeInput.includes("T"))
      ) {
        const timeDate = new Date(timeInput);
        if (!isNaN(timeDate.getTime())) {
          timeStr = timeDate.toISOString().substring(11, 16); // Extract HH:MM
        }
      }

      const timeParts = timeStr.split(":");
      if (timeParts.length < 2) {
        return timeStr;
      }

      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      if (isNaN(hours) || isNaN(minutes)) {
        return timeStr;
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return format(date, "h:mm a");
    } catch (err) {
      return String(timeInput);
    }
  };

  const formatBookingDateTime = (dateInput: any, timeInput: any) => {
    try {
      // Better null/undefined/empty checks
      if (!dateInput || dateInput === null || dateInput === undefined) {
        console.warn("Missing date:", {
          dateInput,
          timeInput,
          type: typeof dateInput,
        });
        return "Date not set";
      }

      if (
        !timeInput ||
        timeInput === null ||
        timeInput === undefined ||
        timeInput === ""
      ) {
        console.warn("Missing time:", {
          dateInput,
          timeInput,
          type: typeof timeInput,
        });
      return "Date not set";
    }

      // Convert timeInput to string if it's not already
      let timeStr = String(timeInput).trim();

      // Handle if timeInput is a Date object or ISO string
      if (
        timeInput instanceof Date ||
        (typeof timeInput === "string" && timeInput.includes("T"))
      ) {
        const timeDate = new Date(timeInput);
        if (!isNaN(timeDate.getTime())) {
          timeStr = timeDate.toISOString().substring(11, 16); // Extract HH:MM
        }
      }

      // Ensure dateInput is turned into a valid Date object
    const parsedDate = new Date(dateInput);
    if (isNaN(parsedDate.getTime())) {
      console.warn("Invalid date format:", dateInput);
      return "Date not set";
    }

      // Extract date parts (year, month, day)
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth(); // 0-based index
    const day = parsedDate.getDate();

      // Extract hours & minutes from time string "HH:MM" or "HH:MM:SS"
      const timeParts = timeStr.split(":");
      if (timeParts.length < 2) {
        console.warn("Invalid time format - no colon:", { timeStr, timeInput });
        return "Date not set";
      }

      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      if (
        isNaN(hours) ||
        isNaN(minutes) ||
        hours < 0 ||
        hours > 23 ||
        minutes < 0 ||
        minutes > 59
      ) {
        console.warn("Invalid time values:", {
          hours,
          minutes,
          timeStr,
          timeInput,
        });
      return "Date not set";
    }

      // Build a correct LOCAL datetime (no timezone conversion)
    const finalDate = new Date(year, month, day, hours, minutes, 0);

      return format(finalDate, "EEEE, MMM d, yyyy");
  } catch (err) {
      console.error("Error formatting date:", err, { dateInput, timeInput });
    return "Date not set";
  }
};

  if (loading) {
    return (
      <>
        <Spinner />
        <p className="text-sm text-accent font-body mt-8">Loading your data</p>
      </>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-30 md:mt-30 px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8 font-heading">
      {/* Header */}
      <div className="text-left sm:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          Welcome,{" "}
          <span className="text-accent italic">
            {user?.username || "Guest"}
          </span>
        </h2>
        <p className="text-gray-400 mt-2 text-xs sm:text-sm md:text-base">
          Here's a summary of your recent booking activity.
        </p>
      </div>

      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { title: "Total", value: totalBookings },
          { title: "Recent (7 days)", value: recentBookings },
          { title: "Upcoming", value: upcomingBookings },
          { title: "Pending", value: pendingBookings },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#1a1a1a] p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl border border-accent/10 shadow-md hover:border-accent/30 transition-all duration-200"
          >
            <h3 className="text-gray-400 text-xs sm:text-sm md:text-base">
              {card.title}
            </h3>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-accent mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6">
  <h3 className="text-lg sm:text-xl font-semibold text-accent mb-3">
    Bookings in Next 3 Days ({bookingsWithinNext3Days.length})
  </h3>

  <div className="">
    {bookingsWithinNext3Days.length === 0 ? (
    <p className="text-gray-400 text-sm">No upcoming bookings within 3 days.</p>
  ) : (
    <div className="flex gap-4">
      {bookingsWithinNext3Days.map((booking) => (
        <div
          key={booking.id}
          className="bg-[#1a1a1a] p-4 rounded-xl border border-accent/10 hover:border-accent/30 transition flex justify-between items-center"
        >
          <div>
            <p className="font-medium text-white text-sm sm:text-base">
              {formatBookingDateTime(booking.date, booking.startTime)}
            </p>
            <p className="text-xs text-gray-400">
              {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
            </p>
          </div>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              booking.status?.toLowerCase() === "pending"
                ? "bg-yellow-500/20 text-yellow-400"
                : booking.status?.toLowerCase() === "confirmed"
                ? "bg-green-500/20 text-green-400"
                : booking.status?.toLowerCase() === "cancelled"
                ? "bg-red-500/20 text-red-400"
                : "bg-accent/20 text-accent"
            }`}
          >
            {booking.status || "Pending"}
          </span>
        </div>
      ))}
    </div>
  )}
  </div>
</div>


      {/* ✅ Filters + Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6 md:mt-8">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <h3 className="text-lg sm:text-xl font-semibold text-accent">
            Bookings Overview
          </h3>
          <button
            onClick={() => navigate("/booking")}
            className="flex items-center justify-center bg-accent/20 hover:bg-accent/40 text-accent p-2 rounded-full transition-all duration-200"
            title="Make a new booking"
          >
            <Plus size={20} />
          </button>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#1a1a1a] text-white border border-accent/20 px-4 py-2 rounded-lg focus:outline-none focus:border-accent/50 transition text-sm sm:text-base w-full sm:w-auto"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* ✅ Bookings List */}
      {filteredBookings.length === 0 ? (
        <p className="text-gray-400 text-center mt-8 text-sm sm:text-base">
          No bookings found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">
          {filteredBookings.map((booking: any) => (
            <Card
              key={booking.id}
              className="bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-accent/10 hover:border-accent/40 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-2 mb-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-semibold text-white mb-1">
                    Studio Session
                  </h4>
                  <p className="text-gray-400 text-xs sm:text-sm mb-1 break-words">
  {formatBookingDateTime(booking.date, booking.startTime)}
</p>
                  <p className="text-gray-300 text-xs sm:text-sm font-medium">
                    {formatTime(booking.startTime)} -{" "}
                    {formatTime(booking.endTime)}
                  </p>
                </div>
                <span
                  className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${
                    booking.status?.toLowerCase() === "pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : booking.status?.toLowerCase() === "confirmed"
                      ? "bg-green-500/20 text-green-400"
                      : booking.status?.toLowerCase() === "cancelled"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {booking.status || "Pending"}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-stretch sm:items-center gap-2 mt-4">
                <Button
                  onClick={() => handleReschedule(booking.id)}
                  disabled={
                    booking.status?.toLowerCase() === "cancelled" ||
                    booking.status?.toLowerCase() === "completed"
                  }
                  className="w-full sm:w-auto sm:flex-1 bg-yellow-500 hover:bg-yellow-600 text-sm sm:text-base py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reschedule
                </Button>
                <Button
                  onClick={() => handleCancelClick(booking.id)}
                  disabled={
                    booking.status?.toLowerCase() === "cancelled" ||
                    booking.status?.toLowerCase() === "completed"
                  }
                  className="w-full sm:w-auto sm:flex-1 bg-red-500 hover:bg-red-600 text-sm sm:text-base py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Booking Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={handleCloseCancelDialog}>
        <DialogContent className="sm:max-w-md max-w-[calc(100vw-2rem)] mx-4 sm:mx-auto">
          <DialogHeader className="space-y-3 sm:space-y-4">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-center sm:text-left">
              Cancel Booking
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base text-center sm:text-left leading-relaxed">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-3 mt-6 sm:mt-4 pt-4 border-t border-gray-700/50">
            <Button
              variant="outline"
              onClick={handleCloseCancelDialog}
              disabled={isCancelling}
              className="w-full sm:w-auto sm:min-w-[140px] h-11 sm:h-9 text-sm sm:text-base font-medium"
            >
              No, Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="w-full sm:w-auto sm:min-w-[160px] h-11 sm:h-9 text-sm sm:text-base font-medium"
            >
              {isCancelling ? "Cancelling..." : "Yes, Cancel Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
