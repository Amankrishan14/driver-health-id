import { z } from "zod";

export const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const;

export const driverSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((v) => {
      const d = new Date(v);
      if (isNaN(d.getTime())) return false;
      const now = new Date();
      const min = new Date();
      min.setFullYear(now.getFullYear() - 100);
      return d <= now && d >= min;
    }, "Enter a valid date of birth"),
  licenseNumber: z
    .string()
    .trim()
    .min(5, "License number is too short")
    .max(20, "License number is too long")
    .regex(/^[A-Z0-9-]+$/i, "Only letters, numbers and dashes allowed"),
  insuranceId: z
    .string()
    .trim()
    .min(4, "Insurance ID is too short")
    .max(24, "Insurance ID is too long"),
  bloodGroup: z.enum(bloodGroups, { message: "Select a blood group" }),
  mobile: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  address: z
    .string()
    .trim()
    .min(10, "Address must be at least 10 characters")
    .max(240, "Address is too long"),
  photo: z
    .string()
    .min(1, "Please upload a photo"),
});

export type DriverData = z.infer<typeof driverSchema>;

export function generateUID() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DHIC-${part()}-${part()}-${part()}`;
}