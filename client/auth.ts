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
    async signIn({ user, account }) {
      if (
        account?.provider !== "google" ||
        !account.providerAccountId ||
        !user.name ||
        !user.email
      ) {
        return false;
      }

      try {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/users/sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              googleId: account.providerAccountId,
              name: user.name,
              email: user.email,
              profilePicture: user.image ?? "",
            }),
          }
        );

        if (!response.ok) {
          console.error(
            "User sync failed:",
            response.status,
            await response.text()
          );

          return false;
        }

        const data = await response.json();
        user.id = data.user._id;
        console.log("User synced successfully:", data.user);
        return true;

      } catch (error) {
        console.error("Unable to connect to Express:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      if (account?.providerAccountId) {
        token.googleId = account.providerAccountId;
      }
if (user?.id) {
        token.mongoUserId = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.googleId) {
        session.user.googleId = token.googleId;
      }
      if (token.mongoUserId) {
        session.user.id = token.mongoUserId;
      }
      return session;
    },
  },
});