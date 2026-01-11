import { z as zodOpenApi } from "@hono/zod-openapi";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { validationHook } from "../../core/validation";

// ============ BASE SCHEMAS ============
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain uppercase letter")
  .regex(/[a-z]/, "Must contain lowercase letter")
  .regex(/[0-9]/, "Must contain number");

// ============ VALIDATION SCHEMAS (for zValidator) ============
const loginValidationSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
  deviceId: z.string().min(1, "Device ID is required"),
});

const signupValidationSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: passwordSchema,
});

const forgotPasswordValidationSchema = z.object({
  email: z.string().email("Invalid email"),
});

const resetPasswordValidationSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: passwordSchema,
});

// ============ OPENAPI SCHEMAS (for documentation) ============
export const loginSchema = zodOpenApi
  .object({
    email: zodOpenApi.string().email().openapi({ example: "user@example.com" }),
    password: zodOpenApi.string().min(1).openapi({ example: "Password123" }),
    deviceId: zodOpenApi.string().min(1).openapi({
      example: "device-uuid-123",
      description: "Required for students, ignored for Admin/Teacher",
    }),
  })
  .openapi("LoginInput");

export const signupSchema = zodOpenApi
  .object({
    email: zodOpenApi.string().email().openapi({ example: "user@example.com" }),
    name: zodOpenApi.string().min(2).openapi({ example: "Ahmed" }),
    password: zodOpenApi
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .openapi({ example: "Password123" }),
  })
  .openapi("SignupInput");

export const forgotPasswordSchema = zodOpenApi
  .object({
    email: zodOpenApi.string().email().openapi({ example: "user@example.com" }),
  })
  .openapi("ForgotPasswordInput");

export const resetPasswordSchema = zodOpenApi
  .object({
    token: zodOpenApi.string().openapi({ example: "reset-token-xyz" }),
    newPassword: zodOpenApi
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[a-z]/)
      .regex(/[0-9]/)
      .openapi({ example: "Password123" }),
  })
  .openapi("ResetPasswordInput");

// ============ VALIDATORS (Middleware) ============
export const loginValidator = zValidator(
  "json",
  loginValidationSchema,
  validationHook
);
export const signupValidator = zValidator(
  "json",
  signupValidationSchema,
  validationHook
);
export const forgotPasswordValidator = zValidator(
  "json",
  forgotPasswordValidationSchema,
  validationHook
);
export const resetPasswordValidator = zValidator(
  "json",
  resetPasswordValidationSchema,
  validationHook
);

// ============ TYPES ============
export type LoginInput = z.infer<typeof loginValidationSchema>;
export type SignupInput = z.infer<typeof signupValidationSchema>;
export type ForgotPasswordInput = z.infer<
  typeof forgotPasswordValidationSchema
>;
export type ResetPasswordInput = z.infer<typeof resetPasswordValidationSchema>;
