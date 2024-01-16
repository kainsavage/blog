import postgres from 'postgres';
import dotenv from 'dotenv';
import { parse } from 'pg-connection-string';
import slugs from '@/helpers/slugs';
import bcrypt from 'bcrypt';
import { User as AuthUser } from 'next-auth';

dotenv.config({ path: '.env.local' });
const options = parse(process.env.DATABASE_URL || '');

let sql: postgres.Sql<Record<string, unknown>>;
// We need to check that we are not in the build stage of the Dockerfile. If so, Next will attempt
// to run this file and will fail because it cannot connect to the database. This is because the
// database is not running yet. We only want to run this file when the container is running.
if (!process.env.NEXTJS_BUILD) {
  sql = postgres({
    host: options.host!,
    port: Number.parseInt(options.port!),
    database: options.database!,
    username: options.user!,
    password: options.password!,
  });
}

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Get all posts from the database.
 */
async function getAllPosts(): Promise<Post[]> {
  if (!sql) return [];

  return sql`SELECT * from posts`;
}

/**
 * Get the most recent post from the database.
 */
async function getMostRecentPost(): Promise<Post> {
  if (!sql) return {} as Post;

  const row: Post[] =
    await sql`SELECT * from posts ORDER BY created_at DESC LIMIT 1`;
  return row[0];
}

/**
 * Get a post by its slug. Converts the slug to a title and then queries the database for the post.
 */
async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const title = slugs.unslugify(slug).toLowerCase();
  const post: Post[] =
    await sql`SELECT * from posts where LOWER(title) = ${title}`;

  return post ? post[0] : undefined;
}

async function getRecentPosts(): Promise<Post[]> {
  if (!sql) return [];

  return sql`SELECT * from posts ORDER BY created_at DESC LIMIT 10`;
}

export type User = {
  id: number;
  username: string;
  password: string;
  created_at: Date;
  updated_at: Date;
};

/**
 * Checks that a user exists - does not return the user.
 */
async function getUser(
  username: string,
  password: string,
): Promise<AuthUser | undefined> {
  if (!sql) return undefined;

  const rows: User[] =
    await sql`SELECT * from users WHERE username = ${username}`;

  if (!rows || rows.length < 1) return undefined;

  try {
    const saltedPasswordToCheck = await bcrypt.hash(password, 10);
    if (!(await bcrypt.compare(password, saltedPasswordToCheck)))
      throw new Error();
  } catch (_) {
    throw new Error('Invalid username or password.');
  }

  return {
    id: rows[0].id.toString(),
    name: rows[0].username,
  };
}

export default {
  getAllPosts,
  getMostRecentPost,
  getPostBySlug,
  getRecentPosts,
  getUser,
};
