import cron from "node-cron";
import prisma from '../config/db.js'



// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Checking for expired bookings...");

  try {
    const result = await prisma.booking.updateMany({
      where: {
        date: { lt: new Date() },
        status: { not: "COMPLETED" },
      },
      data: { status: "COMPLETED" },
    });

    console.log(`✅ ${result.count} bookings marked as COMPLETED`);
  } catch (err) {
    console.error("❌ Error auto-completing bookings:", err);
  }
});
