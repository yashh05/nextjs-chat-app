import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    signIn: async ({ user }) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/create-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to register user on the backend");
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error during user registration:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      if (url.includes("signout")) {
        return `${baseUrl}/api/auth/signin`;
      }
      return baseUrl;
    },
    async jwt({ token, account }) {
      if (account) {
        const newJwt = account.id_token;
        token.userToken = newJwt;
      }
      return token;
    },
    async session({ session, token }) {
      session.loggedUser = token.userToken as string;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
