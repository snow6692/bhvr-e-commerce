import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { requireAdmin } from "../../middlewares/auth.middleware";
import {
  createUserValidator,
  banUserValidator,
  recoveryActionValidator,
  createUserSchema,
  banUserSchema,
  recoveryActionSchema,
  idParamSchema,
} from "./admin.schema";
import {
  createUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  banUserHandler,
  unbanUserHandler,
  getRecoveryRequestsHandler,
  approveRecoveryHandler,
  rejectRecoveryHandler,
} from "./admin.controller";

// ============ ROUTE DEFINITIONS ============
const createUserRoute = createRoute({
  method: "post",
  path: "/users",
  tags: ["Admin"],
  summary: "Create a new user",
  description: "Admin creates a new teacher or student account",
  security: [{ bearerAuth: [] }],
  request: {
    body: { content: { "application/json": { schema: createUserSchema } } },
  },
  responses: {
    201: { description: "User created successfully" },
    400: { description: "Validation error or email exists" },
    403: { description: "Admin only" },
  },
});

const getAllUsersRoute = createRoute({
  method: "get",
  path: "/users",
  tags: ["Admin"],
  summary: "Get all users",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "List of all users" },
    403: { description: "Admin only" },
  },
});

const getUserByIdRoute = createRoute({
  method: "get",
  path: "/users/:id",
  tags: ["Admin"],
  summary: "Get user by ID",
  security: [{ bearerAuth: [] }],
  request: { params: idParamSchema },
  responses: {
    200: { description: "User details" },
    404: { description: "User not found" },
  },
});

const banUserRoute = createRoute({
  method: "patch",
  path: "/users/:id/ban",
  tags: ["Admin"],
  summary: "Ban a user",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: { content: { "application/json": { schema: banUserSchema } } },
  },
  responses: {
    200: { description: "User banned successfully" },
    400: { description: "Validation error or failed to ban" },
  },
});

const unbanUserRoute = createRoute({
  method: "patch",
  path: "/users/:id/unban",
  tags: ["Admin"],
  summary: "Unban a user",
  security: [{ bearerAuth: [] }],
  request: { params: idParamSchema },
  responses: {
    200: { description: "User unbanned successfully" },
    400: { description: "Failed to unban user" },
  },
});

const getRecoveryRequestsRoute = createRoute({
  method: "get",
  path: "/recovery-requests",
  tags: ["Admin"],
  summary: "Get pending recovery requests",
  security: [{ bearerAuth: [] }],
  responses: {
    200: { description: "List of pending requests" },
  },
});

const approveRecoveryRoute = createRoute({
  method: "patch",
  path: "/recovery-requests/:id/approve",
  tags: ["Admin"],
  summary: "Approve recovery request",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: { content: { "application/json": { schema: recoveryActionSchema } } },
  },
  responses: {
    200: { description: "Request approved" },
    400: { description: "Failed to approve" },
  },
});

const rejectRecoveryRoute = createRoute({
  method: "patch",
  path: "/recovery-requests/:id/reject",
  tags: ["Admin"],
  summary: "Reject recovery request",
  security: [{ bearerAuth: [] }],
  request: {
    params: idParamSchema,
    body: { content: { "application/json": { schema: recoveryActionSchema } } },
  },
  responses: {
    200: { description: "Request rejected" },
    400: { description: "Failed to reject" },
  },
});

// ============ REGISTER ROUTES ============
const app = new OpenAPIHono();

// Admin middleware for all routes
app.use("/*", requireAdmin);

// Apply validators
app.use("/users", createUserValidator);
app.use("/users/:id/ban", banUserValidator);
app.use("/recovery-requests/:id/approve", recoveryActionValidator);
app.use("/recovery-requests/:id/reject", recoveryActionValidator);

// Chain openapi routes for proper type inference
export const adminRoute = app
  .openapi(createUserRoute, createUserHandler)
  .openapi(getAllUsersRoute, getAllUsersHandler)
  .openapi(getUserByIdRoute, getUserByIdHandler)
  .openapi(banUserRoute, banUserHandler)
  .openapi(unbanUserRoute, unbanUserHandler)
  .openapi(getRecoveryRequestsRoute, getRecoveryRequestsHandler)
  .openapi(approveRecoveryRoute, approveRecoveryHandler)
  .openapi(rejectRecoveryRoute, rejectRecoveryHandler);
