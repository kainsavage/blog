// import postgres from 'postgres';
// import dotenv from 'dotenv';
// import { parse } from 'pg-connection-string';
import slugs from '@/helpers/slugs';
import bcrypt from 'bcrypt';
import { User as AuthUser } from 'next-auth';
import { sql } from '@vercel/postgres';

// dotenv.config({ path: '.env.local' });
// const options = parse(process.env.DATABASE_URL || '');
//
// let sql: postgres.Sql<Record<string, unknown>>;
// // We need to check that we are not in the build stage of the Dockerfile. If so, Next will attempt
// // to run this file and will fail because it cannot connect to the database. This is because the
// // database is not running yet. We only want to run this file when the container is running.
// if (!process.env.NEXTJS_BUILD) {
//   sql = postgres({
//     host: options.host!,
//     port: Number.parseInt(options.port!),
//     database: options.database!,
//     username: options.user!,
//     password: options.password!,
//     idle_timeout: 10,
//     max_lifetime: 30,
//   });
// }

export type Post = {
  id: number;
  title: string;
  body: string;
  created_at: Date;
  updated_at?: Date;
};

/**
 * Get all posts from the database.
 */
async function getAllPosts(): Promise<Post[]> {
  if (!sql) return [];

  const res = await sql`SELECT * from posts`;
  return res.rows as Post[];
}

/**
 * Get the most recent post from the database.
 */
async function getMostRecentPost(): Promise<Post> {
  if (!sql) return {} as Post;

  const res = await sql`SELECT * from posts ORDER BY created_at DESC LIMIT 1`;
  return res.rows[0] as Post;
}

/**
 * Get a post by its id.
 */
async function getPost(id: number): Promise<Post | undefined> {
  if (!sql) return undefined;

  const res = await sql`SELECT * from posts where id = ${id}`;
  return res.rows ? (res.rows[0] as Post) : undefined;
}

/**
 * Get a post by its slug. Converts the slug to a title and then queries the database for the post.
 */
async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const title = slugs.unslugify(slug).toLowerCase();
  const res = await sql`SELECT * from posts where LOWER(title) = ${title}`;

  return res.rows ? (res.rows[0] as Post) : undefined;
}

async function getRecentPosts(): Promise<Post[]> {
  if (!sql) return [];

  const res = await sql`SELECT * from posts ORDER BY created_at DESC LIMIT 10`;
  return res.rows as Post[];
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

  const res = await sql`SELECT * from users WHERE username = ${username}`;

  if (!res.rows || res.rows.length < 1) return undefined;

  try {
    const saltedPasswordToCheck = await bcrypt.hash(password, 10);
    if (!(await bcrypt.compare(password, saltedPasswordToCheck)))
      throw new Error();
  } catch (_) {
    throw new Error('Invalid username or password.');
  }

  return {
    id: res.rows[0].id.toString(),
    name: res.rows[0].username,
  };
}

export default {
  getAllPosts,
  getMostRecentPost,
  getPost,
  getPostBySlug,
  getRecentPosts,
  getUser,
};
