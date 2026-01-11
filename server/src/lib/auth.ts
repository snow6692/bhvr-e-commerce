import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import prisma from "./db";
import env from "./config";
import { bearer, openAPI } from "better-auth/plugins";
import { resend } from "./resend";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: [env.CLIENT_URL],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // No email verification needed
    minPasswordLength: 8,

    // Forgot Password - sends reset link via email
    sendResetPassword: async ({ user, url }) => {
      try {
        console.log("Sending password reset email to:", user.email);
        await resend.emails.send({
          from: "Courses <onboarding@resend.dev>",
          to: [user.email],
          subject: "Reset your password",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
              <h2>Reset Your Password</h2>
              <p>Click the button below to reset your password:</p>
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
                Reset Password
              </a>
              <p style="margin-top: 20px; color: #666;">This link expires in 1 hour.</p>
            </div>
          `,
        });
        console.log("Password reset email sent successfully");
      } catch (error) {
        console.error("Failed to send password reset email:", error);
        throw error;
      }
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectURI: env.BETTER_AUTH_URL,
    },
  },

  // Additional user fields
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        input: false, // Can't be set by user
      },
      deviceId: {
        type: "string",
        required: false,
        input: false,
      },
      isBanned: {
        type: "boolean",
        defaultValue: false,
        input: false,
      },
      banReason: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },

  plugins: [openAPI(), bearer()],
});

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};
