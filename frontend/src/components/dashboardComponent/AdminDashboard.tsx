import { useEffect, useState } from "react";
import { Link } from "react-router";
import useAuthStore from "../../stores/useAuthStore";
import useBookingStore from "../../stores/useBookingStore";
import Spinner from "../Spinner";

const AdminDashboard = () => {
  const user = useAuthStore((state: any) => state.user);
  const fetchAllBookings = useBookingStore(
    (state: any) => state.fetchAllBookings
  );
  const confirmBooking = useBookingStore((state: any) => state.confirmBooking);
  const loading = useBookingStore((state: any) => state.loading);

  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const data = await fetchAllBookings();
        if (Array.isArray(data)) setAllBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setAllBookings([]);
      }
    };
    fetchAll();
  }, [fetchAllBookings]);

  const now = new Date();
  const totalBookings = allBookings.length;
  const upcomingBookingsList = allBookings
    .filter((b) => new Date(b.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const upcomingBookings = upcomingBookingsList.length;
  const pendingBookings = allBookings.filter(
    (b) => b.status?.toLowerCase() === "pending"
  ).length;
  const completedBookings = allBookings.filter(
    (b) => b.status?.toLowerCase() === "completed"
  ).length;

  const filteredBookings =
    statusFilter === "ALL"
      ? allBookings
      : allBookings.filter((b) => b.status === statusFilter);

  const handleConfirm = async (id: string) => {
    try {
      setConfirmingId(id);
      await confirmBooking(id);
      setAllBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "CONFIRMED" } : b))
      );
    } catch (err) {
      console.error("Error confirming booking:", err);
    } finally {
      setConfirmingId(null);
    }
  };

  // Helper to format time string (e.g., "10:00") to readable format
  const formatTimeString = (timeString: string | Date) => {
    try {
      // If it's already a time string (HH:MM), format it directly
      if (typeof timeString === 'string' && timeString.length <= 5 && timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      // Fallback: if it's a Date object or ISO string
      return new Date(timeString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Error formatting time:", err);
      return String(timeString);
    }
  };

  // Helper to get time difference - handles both string times and dates
  const timeUntil = (date: string, timeString?: string) => {
    try {
      let targetDate: Date;
      
      if (timeString && typeof timeString === 'string' && timeString.length <= 5) {
        // If we have a separate time string, combine with date
        const dateObj = new Date(date);
        const [hours, minutes] = timeString.split(':').map(Number);
        targetDate = new Date(dateObj);
        targetDate.setHours(hours, minutes, 0, 0);
      } else {
        targetDate = new Date(date);
      }
      
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return "Started or Passed";
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 1) return "Less than 1 hour";
      if (hours < 24) return `In ${hours}h`;
      const days = Math.floor(hours / 24);
      return `In ${days} day${days > 1 ? "s" : ""}`;
    } catch (err) {
      return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        {" "}
        <Spinner />{" "}
        <p className="text-sm text-accent font-body mt-8">
          Loading data...
        </p>{" "}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-12 mt-30 font-heading">
      {/* Welcome + Filter */}{" "}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {" "}
        <div>
          {" "}
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Welcome,{" "}
            <span className="text-accent italic">
              {user?.username || "Admin"}
            </span>{" "}
          </h2>{" "}
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Manage and monitor all client bookings easily.{" "}
          </p>{" "}
        </div>
        <div>
          <label className="text-gray-400 mr-2 text-sm">
            Filter by Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-md"
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        {[
          { title: "Total", value: totalBookings, color: "text-white" },
          { title: "Upcoming", value: upcomingBookings, color: "text-accent" },
          {
            title: "Pending",
            value: pendingBookings,
            color: "text-yellow-400",
          },
          {
            title: "Completed",
            value: completedBookings,
            color: "text-blue-400",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-neutral-900 p-6 rounded-2xl shadow-lg border border-neutral-800"
          >
            <h3 className="text-gray-400 font-body text-sm uppercase">
              {card.title}
            </h3>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
      {/* 🆕 Upcoming Bookings Section */}
      {upcomingBookingsList.length > 0 && (
        <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-800 font-heading">
          <h3 className="text-lg font-semibold text-white mb-4">
            Upcoming Bookings
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingBookingsList.slice(0, 6).map((b) => (
              <div
                key={b.id}
                className="bg-neutral-800 rounded-xl p-4 border border-neutral-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-white font-semibold">{b.user?.name}</p>
                  <span
                    className={`text-xs font-semibold rounded-full px-2 py-1 ${
                      b.status === "CONFIRMED"
                        ? "bg-green-500/20 text-green-400"
                        : b.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {new Date(b.date).toLocaleDateString()} —{" "}
                  {formatTimeString(b.startTime)}{" "}
                  to{" "}
                  {formatTimeString(b.endTime)}
                </p>
                <p className="text-accent mt-2 text-xs">
                  {timeUntil(b.date, b.startTime)}
                </p>

                {b.status === "PENDING" && (
                  <button
                    disabled={confirmingId === b.id}
                    onClick={() => handleConfirm(b.id)}
                    className="mt-3 bg-accent text-black font-semibold px-3 py-1 rounded-md hover:bg-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {confirmingId === b.id ? "Confirming..." : "Confirm"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* All Bookings Table */}
      <div className="bg-neutral-900 rounded-2xl shadow-lg p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold text-white mb-4">All Bookings</h3>

        {filteredBookings.length === 0 ? (
          <p className="text-gray-400">No bookings available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border-collapse font-heading">
              <thead>
                <tr className="border-b border-neutral-700 text-gray-400 text-sm uppercase">
                  <th className="p-3">Artist</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-neutral-800 hover:bg-neutral-800 transition-colors"
                  >
                    <td className="p-3 font-body text-white">
                      {booking.user?.name}
                    </td>
                    <td className="p-3 text-gray-300">
                      {new Date(booking.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-gray-300">
                      {formatTimeString(booking.startTime)}
                    </td>
                    <td className="p-3 text-gray-300">
                      {formatTimeString(booking.endTime)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          booking.status === "CONFIRMED"
                            ? "bg-green-500/20 text-green-400"
                            : booking.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : booking.status === "COMPLETED"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-3 items-center">
                      <Link
                        to={`/booking/${booking.id}`}
                        className="text-accent hover:underline text-sm"
                      >
                        View
                      </Link>
                      {booking.status === "PENDING" && (
                        <button
                          disabled={confirmingId === booking.id}
                          onClick={() => handleConfirm(booking.id)}
                          className="bg-accent text-black font-semibold px-3 py-1 rounded-md hover:bg-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {confirmingId === booking.id
                            ? "Confirming..."
                            : "Confirm"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
