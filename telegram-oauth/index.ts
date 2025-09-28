import { z } from "zod";
import { APIError, createAuthEndpoint } from "better-auth/api";
import { setSessionCookie } from "better-auth/cookies";
import type { BetterAuthPlugin } from "better-auth";

export const TelegramBodySchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  photo_url: z.string().optional(),
  auth_date: z.string(),
  hash: z.string(),
});
import { isAuthDateValid, verifyHash } from "./helpers";
import { UserType } from "@/types/user";

interface TelegramOptions {
  disableSignup?: boolean;
  botToken: string;

  // default 24 hours It wont verify after 24 hours
  expiresIn?: number;
}

export const telegramOAuth = (options: TelegramOptions) =>
  ({
    id: "telegram",
    endpoints: {
      telegramCallback: createAuthEndpoint(
        "/telegram/callback",
        {
          method: "POST",
          body: TelegramBodySchema,
          metadata: {
            openapi: {
              summary: "Telegram auth callback",
              description: "Authenticate using Telegram OAuth",
              responses: {
                200: {
                  description: "Successful response",
                  content: {
                    "application/json": {
                      schema: {
                        type: "object",
                        properties: {
                          token: { type: "string" },
                          user: {
                            $ref: "#/components/schemas/User",
                          },
                        },
                      },
                    },
                  },
                },
                400: {
                  description: "Invalid request",
                },
              },
            },
          },
        },
        async (ctx) => {
          const { username, id, first_name, last_name, photo_url, auth_date } =
            ctx.body;

          const { botToken, expiresIn } = options;

          const telegram_id = id;
          const name = `${first_name}${last_name ? " " + last_name : ""}`;
          const image = photo_url;

          if (!isAuthDateValid(auth_date, expiresIn))
            throw new APIError("UNAUTHORIZED", {
              message: "Auth data is too old. Rejecting login",
            });

          // const payload = mapTelegramBodyToPayload(ctx.body);

          if (!verifyHash(ctx.body, botToken))
            throw new APIError("UNAUTHORIZED", {
              message: "Invalid Telegram signature",
            });

          const existingAccount = await ctx.context.internalAdapter.findAccount(
            telegram_id
          );

          // variable to hold if there user is logged in before
          let userId: string | null = null;

          if (existingAccount) {
            userId = existingAccount.userId;
            console.log("user found");
          } else {
            //  create user
            const newUser = await ctx.context.internalAdapter.createUser({
              username,
              name,
              emailVerified: false,
              email: "https://t.me/" + (username || userId), // use || instead of 'or'
              image,
            });

            userId = newUser.id;
            // create account and link it to usee
            await ctx.context.internalAdapter.createAccount({
              userId: userId,
              providerId: "telegram",
              accountId: telegram_id,
            });
          }

          const session = await ctx.context.internalAdapter.createSession(
            userId,
            ctx
          );

          //here it's gurantted there is use with userID

          const user = (await ctx.context.internalAdapter.findUserById(
            userId
          )) as UserType;

          if (!user)
            throw new APIError("NOT_FOUND", {
              message: "User not found",
            });

          const sessionUser = {
            id: user.id,
            name: user.name,
            emailVerified: user.email_verified ?? false,
            email: user.email ?? "",
            createdAt: user.created_at ?? new Date(),
            updatedAt: user.updated_at ?? new Date(),
            image: user.image,
          } as {
            id: string;
            name: string;
            emailVerified: boolean;
            email: string;
            createdAt: Date;
            updatedAt: Date;
            image?: string | null | undefined;
            phone?: string;
          };

          await setSessionCookie(ctx, {
            user: sessionUser,
            session,
          });
          return ctx.json({
            token: session.token,
            user: {
              username,
              role: user.role!,
              id: user.id,
              email: user.email,
              emailVerified: user.email_verified,
              telegram_id: user.telegram_id!,
              name: user.name,
              image: user.image,
              createdAt: user.created_at,
              updatedAt: user.updated_at,
            },
          });
        }
      ),
    },
  } satisfies BetterAuthPlugin);
