import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google,
    Password({
      profile(params) {
        const email =
          typeof params.email === "string"
            ? params.email.trim().toLowerCase()
            : "";
        const name =
          typeof params.name === "string" && params.name.trim().length > 0
            ? params.name.trim()
            : undefined;

        return {
          email,
          ...(name ? { name } : {}),
        };
      },
    }),
  ],
});
