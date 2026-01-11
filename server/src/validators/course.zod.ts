import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

export const createCourse = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(100),
  price: z.number().min(0),
  image: z.string().url(),
});

export const createCourseValidator = zValidator(
  "json",
  createCourse,
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          success: false,
          error: result.error.flatten().fieldErrors,
        },
        400
      );
    }
  }
);
