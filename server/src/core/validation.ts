import { z } from "zod";

/**
 * Shared validation hook for Hono zValidator
 * Returns formatted error response on validation failure
 */
export const validationHook = (
  result: { success: boolean; error?: z.ZodError },
  c: any
) => {
  if (!result.success) {
    return c.json(
      {
        success: false,
        message: "Validation failed",
        errors: result.error?.flatten().fieldErrors,
      },
      400
    );
  }
};
