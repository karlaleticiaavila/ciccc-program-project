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

        console.log("MongoDB user synchronized:", data.user._id);

        return true;
      } catch (error) {
        console.error("Unable to connect to Express:", error);
        return false;
      }
    },

    async jwt({ token, account }) {
      if (account?.providerAccountId) {
        token.googleId = account.providerAccountId;
      }

      return token;
    },

    async session({ session }) {
      return session;
    },
  },
});