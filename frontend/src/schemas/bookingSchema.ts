import { z } from "zod";

export const bookingSchema = z.object({
   date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
    startTime: z.string().nonempty("Start time is required"),
    endTime: z.string().nonempty("End time is required"),
    notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
})
.refine(
    (data) => {
      const start = new Date(`${data.date}T${data.startTime}`);
      const end = new Date(`${data.date}T${data.endTime}`);
      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type BookingFormData = z.infer<typeof bookingSchema>;
