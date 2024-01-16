import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import db from '@/helpers/db';

export const config = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Sign In',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        let user = null;

        try {
          user = await db.getUser(credentials.username, credentials.password);
        } catch (e) {
          console.error(e);
        }

        if (!user) {
          throw new Error('User was not found and could not be created.');
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthOptions;

export const { handlers, auth } = NextAuth(config);
