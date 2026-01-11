import type { Context } from "hono";
import {
  createUser,
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  getPendingRecoveryRequests,
  approveRecoveryRequest,
  rejectRecoveryRequest,
} from "./admin.service";
import {
  successResponse, 
  notFoundResponse,
  badRequestResponse,
} from "../../lib/response";

// ============ CREATE USER ============
export async function createUserHandler(c: Context) {
  try {
    const input = await c.req.json();
    const user = await createUser(input);
    return successResponse(c, { user }, "User created successfully", 201);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create user";
    return badRequestResponse(c, message);
  }
}

// ============ GET ALL USERS ============
export async function getAllUsersHandler(c: Context) {
  const users = await getAllUsers();
  return successResponse(c, { users }, "Users retrieved successfully");
}

// ============ GET USER BY ID ============
export async function getUserByIdHandler(c: Context) {
  const id = c.req.param("id");
  const user = await getUserById(id);

  if (!user) {
    return notFoundResponse(c, "User not found");
  }

  return successResponse(c, { user }, "User retrieved successfully");
}

// ============ BAN USER ============
export async function banUserHandler(c: Context) {
  const id = c.req.param("id");
  const { reason } = await c.req.json<{ reason: string }>();

  try {
    const user = await banUser(id, reason);
    return successResponse(c, { user }, "User banned successfully");
  } catch (error) {
    return badRequestResponse(c, "Failed to ban user");
  }
}

// ============ UNBAN USER ============
export async function unbanUserHandler(c: Context) {
  const id = c.req.param("id");

  try {
    const user = await unbanUser(id);
    return successResponse(c, { user }, "User unbanned successfully");
  } catch (error) {
    return badRequestResponse(c, "Failed to unban user");
  }
}

// ============ GET RECOVERY REQUESTS ============
export async function getRecoveryRequestsHandler(c: Context) {
  const requests = await getPendingRecoveryRequests();
  return successResponse(
    c,
    { requests },
    "Recovery requests retrieved successfully"
  );
}

// ============ APPROVE RECOVERY ============
export async function approveRecoveryHandler(c: Context) {
  const id = c.req.param("id");
  const input = await c.req.json();

  try {
    await approveRecoveryRequest(id, input?.adminNote);
    return successResponse(c, null, "Recovery request approved");
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to approve request";
    return badRequestResponse(c, message);
  }
}

// ============ REJECT RECOVERY ============
export async function rejectRecoveryHandler(c: Context) {
  const id = c.req.param("id");
  const input = await c.req.json();

  try {
    await rejectRecoveryRequest(id, input?.adminNote);
    return successResponse(c, null, "Recovery request rejected");
  } catch (error) {
    return badRequestResponse(c, "Failed to reject request");
  }
}
