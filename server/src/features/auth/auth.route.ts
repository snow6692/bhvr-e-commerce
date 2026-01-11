import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import {
  loginValidator,
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema";
import {
  loginHandler,
  signupHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from "./auth.controller";

// ============ ROUTE DEFINITIONS ============
const loginRoute = createRoute({
  method: "post",
  path: "/login",
  tags: ["Auth"],
  summary: "Login with email and password",
  description: "Authenticate user. Device binding only applies to students.",
  request: {
    body: { content: { "application/json": { schema: loginSchema } } },
  },
  responses: {
    200: { description: "Login successful" },
    400: { description: "Validation error" },
    401: { description: "Invalid credentials" },
    403: { description: "Account banned or device mismatch" },
  },
});

const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  tags: ["Auth"],
  summary: "Create a new account",
  description: "Register new user. Device binding happens on first login.",
  request: {
    body: { content: { "application/json": { schema: signupSchema } } },
  },
  responses: {
    201: { description: "Account created successfully" },
    400: { description: "Validation error or email already registered" },
  },
});

const forgotPasswordRoute = createRoute({
  method: "post",
  path: "/forgot-password",
  tags: ["Auth"],
  summary: "Request password reset",
  description: "Sends a password reset link to the email if it exists",
  request: {
    body: { content: { "application/json": { schema: forgotPasswordSchema } } },
  },
  responses: {
    200: { description: "Reset link sent if email exists" },
    400: { description: "Validation error" },
  },
});

const resetPasswordRoute = createRoute({
  method: "post",
  path: "/reset-password",
  tags: ["Auth"],
  summary: "Reset password with token",
  description: "Reset password using the token from the email link",
  request: {
    body: { content: { "application/json": { schema: resetPasswordSchema } } },
  },
  responses: {
    200: { description: "Password reset successfully" },
    400: { description: "Validation error or invalid token" },
  },
});

// ============ REGISTER ROUTES ============
const app = new OpenAPIHono();

// Apply validators as middleware
app.use("/login", loginValidator);
app.use("/signup", signupValidator);
app.use("/forgot-password", forgotPasswordValidator);
app.use("/reset-password", resetPasswordValidator);

// Chain openapi routes for proper type inference
export const authRoute = app
  .openapi(loginRoute, loginHandler)
  .openapi(signupRoute, signupHandler)
  .openapi(forgotPasswordRoute, forgotPasswordHandler)
  .openapi(resetPasswordRoute, resetPasswordHandler);
