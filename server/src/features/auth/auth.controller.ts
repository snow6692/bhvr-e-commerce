import type { Context } from "hono";
import prisma from "../../lib/db";
import { auth } from "../../lib/auth";
import { checkDeviceBinding, bindDevice } from "./device.service";
import {
  successResponse,
  errorResponse,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
} from "../../lib/response";

// ============ LOGIN ============
export async function loginHandler(c: Context) {
  const { email, password, deviceId } = await c.req.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return unauthorizedResponse(c, "Invalid credentials");
    }

    if (user.isBanned) {
      return errorResponse(
        c,
        user.banReason || "Account is banned",
        403,
        "Account banned"
      );
    }

    // Device binding only for USER role (students)
    if (user.role === "USER") {
      const deviceCheck = await checkDeviceBinding(user.id, deviceId);

      if (!deviceCheck.allowed) {
        return errorResponse(
          c,
          deviceCheck.reason || "Device not allowed",
          403,
          "Device mismatch"
        );
      }

      if (!user.deviceId) {
        await bindDevice(user.id, deviceId);
      }
    }

    const response = await auth.api.signInEmail({ body: { email, password } });

    return successResponse(
      c,
      { user: response.user, token: response.token },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return unauthorizedResponse(c, "Invalid credentials");
  }
}

// ============ SIGNUP ============
export async function signupHandler(c: Context) {
  const { email, password, name } = await c.req.json();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return badRequestResponse(c, "Email already registered");
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

    return successResponse(
      c,
      {
        user: { ...response.user, emailVerified: true },
        token: response.token,
      },
      "Account created successfully",
      201
    );
  } catch (error) {
    console.error("Signup error:", error);
    return serverErrorResponse(c, "Signup failed");
  }
}

// ============ FORGOT PASSWORD ============
export async function forgotPasswordHandler(c: Context) {
  const { email } = await c.req.json();

  try {
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: "/reset-password" },
    });
    return successResponse(
      c,
      null,
      "If email exists, a reset link will be sent"
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return successResponse(
      c,
      null,
      "If email exists, a reset link will be sent"
    );
  }
}

// ============ RESET PASSWORD ============
export async function resetPasswordHandler(c: Context) {
  const { token, newPassword } = await c.req.json();

  try {
    await auth.api.resetPassword({ body: { token, newPassword } });
    return successResponse(c, null, "Password reset successfully");
  } catch (error) {
    console.error("Reset password error:", error);
    return badRequestResponse(c, "Failed to reset password");
  }
}
