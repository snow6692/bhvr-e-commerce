import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import prisma from "../../lib/db";
import { auth } from "../../lib/auth";
import {
  loginValidator,
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  googleAuthValidator,
  recoveryRequestValidator,
  emailQueryValidator,
} from "./auth.schema";
import {
  checkDeviceBinding,
  bindDevice,
  createRecoveryRequest,
  getLatestRecoveryStatus,
} from "./auth.service";

// ============ AUTH ROUTES ============
export const authRoute = new Hono()
  // ============ LOGIN ============
  .post("/login", loginValidator, async (c) => {
    const { email, password, deviceId } = c.req.valid("json");

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }

    if (user.isBanned) {
      throw new HTTPException(403, {
        message: user.banReason || "Account is banned",
      });
    }

    // Device binding only for USER role (students) with deviceId (mobile apps)
    if (user.role === "USER" && deviceId) {
      const deviceCheck = await checkDeviceBinding(user.id, deviceId);

      if (!deviceCheck.allowed) {
        throw new HTTPException(403, {
          message: deviceCheck.reason || "Device not allowed",
        });
      }

      if (deviceCheck.needsBinding) {
        await bindDevice(user.id, deviceId);
      }
    }

    // Get the full response with Set-Cookie headers
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: true,
    });

    // Return the response directly so cookies are set
    return response;
  })

  // ============ SIGNUP ============
  .post("/signup", signupValidator, async (c) => {
    const { email, password, name } = c.req.valid("json");

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new HTTPException(400, { message: "Email already registered" });
    }

    const response = await auth.api.signUpEmail({
      body: { email, password, name },
    });

    // Auto-verify email
    if (response.user?.id) {
      await prisma.user.update({
        where: { id: response.user.id },
        data: { emailVerified: true },
      });
    }

    return c.json(
      {
        success: true,
        message: "Account created successfully",
        data: {
          user: { ...response.user, emailVerified: true },
          token: response.token,
        },
      },
      201,
    );
  })

  // ============ GOOGLE LOGIN ============
  .post("/google", googleAuthValidator, async (c) => {
    // For mobile apps, the client already has the Google ID token
    // Better-auth handles Google OAuth via its built-in routes
    return c.json({
      success: true,
      message: "Use /api/auth/signin/google for Google authentication",
      data: {
        authUrl: "/api/auth/signin/google",
        callbackUrl: "/api/auth/callback/google",
      },
    });
  })

  // ============ FORGOT PASSWORD ============
  .post("/forgot-password", forgotPasswordValidator, async (c) => {
    const { email } = c.req.valid("json");

    try {
      await auth.api.requestPasswordReset({
        body: { email, redirectTo: "/reset-password" },
      });
    } catch {
      // Ignore errors to prevent email enumeration
    }

    // Always return success to prevent email enumeration
    return c.json({
      success: true,
      message: "If email exists, a reset link will be sent",
    });
  })

  // ============ RESET PASSWORD ============
  .post("/reset-password", resetPasswordValidator, async (c) => {
    const { token, newPassword } = c.req.valid("json");
    await auth.api.resetPassword({ body: { token, newPassword } });
    return c.json({ success: true, message: "Password reset successfully" });
  })

  // ============ RECOVERY REQUEST ============
  .post("/recovery/request", recoveryRequestValidator, async (c) => {
    const { email, message, deviceId } = c.req.valid("json");

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isBanned: true },
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    if (!user.isBanned) {
      throw new HTTPException(400, { message: "Account is not banned" });
    }

    const request = await createRecoveryRequest(user.id, { message, deviceId });

    return c.json(
      {
        success: true,
        message: "Recovery request submitted successfully",
        data: { requestId: request.id },
      },
      201,
    );
  })

  // ============ RECOVERY STATUS ============
  .get("/recovery/status", emailQueryValidator, async (c) => {
    const { email } = c.req.valid("query");

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    const status = await getLatestRecoveryStatus(user.id);

    if (!status) {
      throw new HTTPException(404, { message: "No recovery request found" });
    }

    return c.json({
      success: true,
      message: "Recovery status retrieved",
      data: { status },
    });
  })

  // ============ GET CURRENT USER ============
  .get("/me", async (c) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      throw new HTTPException(401, { message: "Not authenticated" });
    }

    return c.json({
      success: true,
      user: session.user,
    });
  })

  // ============ LOGOUT ============
  .post("/logout", async (c) => {
    await auth.api.signOut({
      headers: c.req.raw.headers,
    });

    return c.json({
      success: true,
      message: "Logged out successfully",
    });
  });
