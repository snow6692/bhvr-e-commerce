import { hc } from "hono/client";
import type { AppType } from "./index";

export type { AppType };
export type client = ReturnType<typeof hc<AppType>>;

export const hcWithType = (...args: Parameters<typeof hc>) =>
  hc<AppType>(...args);
