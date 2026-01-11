import { cors } from "hono/cors";
import env from "../lib/config";

export const CorsMiddleware = cors({
  origin: env.CLIENT_URL,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
});
