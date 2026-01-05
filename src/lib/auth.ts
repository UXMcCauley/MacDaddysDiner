import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

// Extend global type
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "email-signup",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const email = credentials.email as string;
        const name = (credentials.name as string) || email.split("@")[0];

        try {
          // Connect to MongoDB and find/create user
          const client = await clientPromise;
          const db = client.db(process.env.MONGODB_DB);
          const users = db.collection("users");
          const subscribers = db.collection("subscribers");

          // Check if user exists
          let user = await users.findOne({ email });

          if (!user) {
            // Create new user
            const result = await users.insertOne({
              email,
              name,
              emailVerified: new Date(),
              createdAt: new Date(),
            });
            user = { _id: result.insertedId, email, name };
          }

          // Also add to subscribers collection for mailing list
          await subscribers.updateOne(
            { email },
            {
              $set: {
                email,
                name,
                subscribedAt: new Date(),
                source: "website-signup",
              },
            },
            { upsert: true }
          );

          return {
            id: user._id.toString(),
            email: user.email as string,
            name: (user.name as string) || name,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  trustHost: true,
});
