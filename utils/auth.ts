import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/drizzle";
import schema from "../db/schema";
import { nextCookies } from "better-auth/next-js";
import { admin, createAuthMiddleware } from "better-auth/plugins";
import { telegramOAuth } from "../telegram-oauth/index";
import syncUser from "@/server/user/sync-user";
const botToken = process.env.TELEGRAM_BOT_TOKEN!;
export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account", // optional: always show account picker
      // accessType: "offline", // optional: to get refresh token
    },
  },

  // databaseHooks: {
  //   user: {
  //     create: {
  //       after: async (user) => {
  //         const { id } = user;
  //         console.log(id, "idddddddddddddddddddddddddddddddddddddddd");
  //       },
  //     },
  //   },
  // },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const newSession = ctx.context.newSession;
      if (newSession) {
        console.log("Session found.................");
        return await syncUser({ id: newSession.user.id });
      }
    }),
  },

  // telemetry: {
  //   debug: true
  // } ,
  user: {
    additionalFields: {
      username: {
        type: "string",
        required: false,
        input: false,
      },
      kyc_status: {
        type: "string",
        required: false,
        input: true,
      },
      withdrawal_password: {
        type: "string",
        required: false,
        input: true,
      },
      telegram_id: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  plugins: [
    telegramOAuth({ botToken }),
    admin({ defaultRole: "user" }),
    nextCookies(),
  ],
});
