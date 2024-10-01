import { z } from "zod";

export const attendanceSchema = z.object({
  studentId: z.string().min(2, {
    message: "Student Id is required",
  }),
  courseId: z.string().min(2, {
    message: "Course Id is required",
  }),
  action: z.string().min(2, {
    message: "Action Id is required",
  }),
});

export const SummarySchema = z.object({
  courseId: z.string().min(2, { message: "Course Id is required" }),
});