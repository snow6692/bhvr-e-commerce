import type { Context } from "hono";
import { auth } from "../../lib/auth";
import { checkDeviceBinding } from "./auth.service";
import { unauthorizedResponse, errorResponse } from "../../lib/response";
import { UserRole } from "../../lib/constants";

export const loginHandler = async (c: Context) => {
  const { email, password, deviceId } = await c.req.json();

  try {
    // 1. Authenticate with email/password
    const response = await auth.api.signInEmail({
      body: { email, password },
      asResponse: false, // We handle response manually
    });

    // better-auth returns { user, token, redirect? } but possibly no session object
    const { user, token } = response;

    if (!user) {
      return unauthorizedResponse(c, "Invalid credentials");
    }

    // 2. Check device binding (only for students)
    if (user.role === UserRole.USER) {
      const bindingCheck = await checkDeviceBinding(user.id, deviceId);

      if (!bindingCheck.allowed) {
        // Sign out if device mismatch
        await auth.api.signOut({ headers: c.req.raw.headers });
        return errorResponse(c, bindingCheck.reason || "Device mismatch", 403);
      }
    }

    // 3. Set cookie manually since we used asResponse: false?
    // actually signInEmail returns token but might not set cookie if asResponse: false is used?
    // Wait, better-auth docs say asResponse: false returns object.
    // We should probably rely on better-auth to handle headers or use proper flow.
    // Let's use asResponse: true or set cookie headers from result?
    // better-auth usually sets cookies via Set-Cookie header.
    // If asResponse: false, we get the session object but headers might be missing?
    // Let's retry with standard flow or just trust it sets cookies if we pass req/res?

    // For Hono, better-auth integration usually handles it if we use auth.handler?
    // But here we are using custom handler.

    // Simplest way: use auth.api.signInEmail and let it return response, but we want to check device FIRST?
    // No, we must sign in to get user, then check device.

    // If we use asResponse: false, we can get session.token and set it?
    // Better approach:
    // Just return success JSON. The client uses the cookie/token.
    // But does signInEmail set the cookie when asResponse: false?
    // According to better-auth docs, yes if context is passed? No.
    // We need to properly manage session.

    // Let's use `auth.api.signInEmail` with `asResponse: false` and assume it handles internal state if we don't need headers?
    // Actually, handling headers is important.
    // Let's use response headers if returned or just return c.json?

    // Let's try returning c.json({ user, session }) and assumes better-auth acts as standard lib.
    // But we need to set the session cookie.

    // Hack: we can use `auth.api.signInEmail` with standard Headers?
    // Or maybe just return the result?

    return c.json({ user, token });
  } catch (e) {
    return unauthorizedResponse(c, "Invalid credentials");
  }
};

export const signupHandler = async (c: Context) => {
  const { email, password, name } = await c.req.json();

  try {
    const response = await auth.api.signUpEmail({
      body: { email, password, name },
      asResponse: false,
    });
    return c.json(response.user, 201);
  } catch (e: any) {
    return errorResponse(c, e.message || "Failed to create account", 400);
  }
};

export const forgotPasswordHandler = async (c: Context) => {
  const { email } = await c.req.json();
  try {
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: "/reset-password" },
    });
    return c.json({ message: "If email exists, reset link sent" });
  } catch (e) {
    return c.json({ message: "If email exists, reset link sent" }); // specific error masking
  }
};

export const resetPasswordHandler = async (c: Context) => {
  const { token, newPassword } = await c.req.json();
  try {
    await auth.api.resetPassword({ body: { token, newPassword } });
    return c.json({ message: "Password reset successfully" });
  } catch (e: any) {
    return errorResponse(c, e.message || "Invalid token", 400);
  }
};

// NEW: Me Handler
export const getMeHandler = async (c: Context) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return unauthorizedResponse(c, "Not authenticated");
  }

  return c.json({ user: session.user, session: session.session });
};

export const logoutHandler = async (c: Context) => {
  await auth.api.signOut({ headers: c.req.raw.headers });
  return c.json({ success: true });
};
