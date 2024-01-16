import NextAuth from 'next-auth';
import { config } from '@/helpers/auth';

export const handler = NextAuth(config);

export { handler as GET, handler as POST };
