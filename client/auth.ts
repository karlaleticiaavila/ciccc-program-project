import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,

  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),

    Apple({
      clientId: process.env.AUTH_APPLE_ID as string,
      clientSecret: process.env.AUTH_APPLE_SECRET as string,
    }),

    Credentials({
      name: "Email and Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email
            : "";

        const password =
          typeof credentials?.password === "string"
            ? credentials.password
            : "";

        if (!email || !password) {
          return null;
        }

        const response = await fetch(
          `${process.env.BACKEND_URL}/api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

        if (!response.ok) {
          return null;
        }

        const data = await response.json();

        return {
          id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.profilePicture || null,

          mongoUserId: data.user._id,
          accessToken: data.accessToken,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account, user }) {
      // GOOGLE
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

          throw new Error(
            `Google user sync failed: ${message}`
          );
        }

        const data = await response.json();

        token.googleId = account.providerAccountId;
        token.mongoUserId = data.user._id;
        token.accessToken = data.accessToken;
      }

      // APPLE
      if (
        account?.provider === "apple" &&
        account.providerAccountId
      ) {
        const response = await fetch(
          `${process.env.BACKEND_URL}/api/users/sync-apple`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appleId: account.providerAccountId,
              name: token.name || "Apple User",
              email: token.email || undefined,
            }),
          }
        );

        if (!response.ok) {
          const message = await response.text();

          throw new Error(
            `Apple user sync failed: ${message}`
          );
        }

        const data = await response.json();

        token.mongoUserId = data.user._id;
        token.accessToken = data.accessToken;
      }

      // EMAIL / PASSWORD
      if (
        account?.provider === "credentials" &&
        user
      ) {
        if (
          "mongoUserId" in user &&
          typeof user.mongoUserId === "string"
        ) {
          token.mongoUserId =
            user.mongoUserId;
        }

        if (
          "accessToken" in user &&
          typeof user.accessToken === "string"
        ) {
          token.accessToken =
            user.accessToken;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        if (
          typeof token.mongoUserId === "string"
        ) {
          session.user.id =
            token.mongoUserId;
        }

        if (
          typeof token.googleId === "string"
        ) {
          session.user.googleId =
            token.googleId;
        }
      }

      if (
        typeof token.accessToken === "string"
      ) {
        session.accessToken =
          token.accessToken;
      }

      return session;
    },
  },
});