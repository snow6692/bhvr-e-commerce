import { z as zodOpenApi } from "@hono/zod-openapi";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { validationHook } from "../../core/validation";

// ============ VALIDATION SCHEMAS (for zValidator) ============
const recoveryRequestValidationSchema = z.object({
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  deviceId: z.string().min(1, "Device ID is required"),
});

// ============ OPENAPI SCHEMAS (for documentation) ============
export const recoveryRequestSchema = zodOpenApi
  .object({
    email: zodOpenApi
      .string()
      .email()
      .openapi({ example: "banned@example.com" }),
    message: zodOpenApi.string().min(10).openapi({
      example: "I was banned by mistake, please review my account",
    }),
    deviceId: zodOpenApi
      .string()
      .min(1)
      .openapi({ example: "device-uuid-123" }),
  })
  .openapi("RecoveryRequestInput");

export const emailQuerySchema = zodOpenApi.object({
  email: zodOpenApi
    .string()
    .email()
    .openapi({
      param: { name: "email", in: "query" },
      example: "user@example.com",
    }),
});

// ============ VALIDATORS (Middleware) ============
export const recoveryRequestValidator = zValidator(
  "json",
  recoveryRequestValidationSchema,
  validationHook
);

// ============ TYPES ============
export type RecoveryRequestInput = z.infer<
  typeof recoveryRequestValidationSchema
>;
