import type { telegramOAuth } from "./index";
import { BetterAuthClientPlugin } from "better-auth";

export const telegramAuthClient = () => {
  return {
    id: "telegram",
    $InferServerPlugin: {} as ReturnType<typeof telegramOAuth>,
  } satisfies BetterAuthClientPlugin;
};
