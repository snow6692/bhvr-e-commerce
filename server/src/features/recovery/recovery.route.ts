import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  recoveryRequestValidator,
  recoveryRequestSchema,
  emailQuerySchema,
} from "./recovery.schema";
import {
  submitRecoveryHandler,
  checkStatusHandler,
} from "./recovery.controller";

// ============ ROUTE DEFINITIONS ============
const submitRecoveryRoute = createRoute({
  method: "post",
  path: "/request",
  tags: ["Recovery"],
  summary: "Submit recovery request",
  description: "For banned users to request account recovery",
  request: {
    body: {
      content: { "application/json": { schema: recoveryRequestSchema } },
    },
  },
  responses: {
    201: { description: "Request submitted successfully" },
    400: { description: "Validation error or account not banned" },
    404: { description: "User not found" },
  },
});

const checkStatusRoute = createRoute({
  method: "get",
  path: "/status",
  tags: ["Recovery"],
  summary: "Check recovery status",
  description: "Check the status of a recovery request by email",
  request: {
    query: emailQuerySchema,
  },
  responses: {
    200: { description: "Recovery status returned" },
    400: { description: "Email is required" },
    404: { description: "User or request not found" },
  },
});

// ============ REGISTER ROUTES ============
const app = new OpenAPIHono();

// Apply validators
app.use("/request", recoveryRequestValidator);

// Chain openapi routes for proper type inference
export const recoveryRoute = app
  .openapi(submitRecoveryRoute, submitRecoveryHandler)
  .openapi(checkStatusRoute, checkStatusHandler);
