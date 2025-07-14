import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "../../../models/User";
import bcrypt from "bcrypt";
import connectToDatabase from "../../../lib/mongoose";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      userType: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    username: string;
    userType: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    userType: string;
  }
}

type VerifyUserParams = {
  email: string;
  password: string;
};

async function verifyUser({ email, password }: VerifyUserParams) {
  await connectToDatabase();
  const user = await User.findOne({ email });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    userType: user.userType,
  };
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await verifyUser({
          email: credentials.email,
          password: credentials.password,
        });
        if (!user) return null;
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.userType = user.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.userType = token.userType;
      }
      return session;
    },
  },
});
