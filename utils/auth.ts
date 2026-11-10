import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { createAuthClient } from "better-auth/react";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      enabled: true,
      clientId: "",
      clientSecret: ""
    }
  }
});

export const authClient = createAuthClient({ });