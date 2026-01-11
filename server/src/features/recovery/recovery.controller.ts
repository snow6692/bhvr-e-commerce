import type { Context } from "hono";
import prisma from "../../lib/db";
import {
  createRecoveryRequest,
  getLatestRecoveryStatus,
} from "./recovery.service";
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
} from "../../lib/response";

// ============ SUBMIT RECOVERY REQUEST ============
export async function submitRecoveryHandler(c: Context) {
  try {
    const { email, message, deviceId } = await c.req.json();

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isBanned: true },
    });

    if (!user) {
      return notFoundResponse(c, "User not found");
    }

    if (!user.isBanned) {
      return badRequestResponse(c, "Account is not banned");
    }

    const request = await createRecoveryRequest(user.id, { message, deviceId });

    return successResponse(
      c,
      { requestId: request.id },
      "Recovery request submitted successfully",
      201
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Failed to submit recovery request";
    return badRequestResponse(c, errorMessage);
  }
}

// ============ CHECK RECOVERY STATUS ============
export async function checkStatusHandler(c: Context) {
  const email = c.req.query("email");

  if (!email) {
    return badRequestResponse(c, "Email is required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (!user) {
    return notFoundResponse(c, "User not found");
  }

  const status = await getLatestRecoveryStatus(user.id);

  if (!status) {
    return notFoundResponse(c, "No recovery request found");
  }

  return successResponse(c, { status }, "Recovery status retrieved");
}
