import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      // Solo se ejecuta al iniciar sesión con Google.
      if (
        account?.provider === "google" &&
        account.providerAccountId &&
        token.name &&
        token.email
      ) {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/users/sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              name: token.name,
              email: token.email,
              profilePicture:
                typeof token.picture === "string"
                  ? token.picture
                  : "",
            }),
          }
        );

        if (!response.ok) {
          const message = await response.text();
          throw new Error(`User sync failed: ${message}`);
        }

        const data = await response.json();

        token.googleId = account.providerAccountId;
        token.mongoUserId = data.user._id;
        token.accessToken = data.accessToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (typeof token.mongoUserId === "string") {
          session.user.id = token.mongoUserId;
        }

        if (typeof token.googleId === "string") {
          session.user.googleId = token.googleId;
        }
      }

      if (typeof token.accessToken === "string") {
        session.accessToken = token.accessToken;
      }

      return session;
    },
  },
});