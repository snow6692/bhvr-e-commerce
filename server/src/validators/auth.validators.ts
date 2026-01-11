import { z } from "zod";

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Create user by admin schema
export const createUserSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: passwordSchema,
  role: z.enum(["TEACHER", "USER"]),
});

// User signup schema (self-registration)
export const signupSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: passwordSchema,
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  deviceId: z.string().min(1, "Device ID is required"),
});

// Recovery request schema
export const recoveryRequestSchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters"),
  deviceId: z.string().min(1, "Device ID is required"),
});

// Admin recovery action schema
export const recoveryActionSchema = z.object({
  adminNote: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RecoveryRequestInput = z.infer<typeof recoveryRequestSchema>;
export type RecoveryActionInput = z.infer<typeof recoveryActionSchema>;
