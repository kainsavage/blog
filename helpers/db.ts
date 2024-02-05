import slugs from '@/helpers/slugs';
import bcrypt from 'bcrypt';
import { User as AuthUser } from 'next-auth';
import { sql } from '@vercel/postgres';

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
  if (!sql) return;

  const res = await sql`SELECT * from posts where id = ${id}`;
  return res.rows ? (res.rows[0] as Post) : undefined;
}

/**
 * Create a new post.
 */
async function createPost(title: string, body: string) {
  if (!sql) return;

  const resp =
    await sql`INSERT INTO posts (title, body) VALUES (${title}, ${body})`;

  if (resp.rowCount < 1) throw new Error('Failed to create post');
}

/**
 * Edit a post by its id.
 */
async function editPost(id: number, title: string, body: string) {
  if (!sql) return;

  const resp =
    await sql`UPDATE posts SET title = ${title}, body = ${body}, updated_at = NOW() WHERE id = ${id}`;

  if (resp.rowCount < 1) throw new Error('Failed to edit post');
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
  if (!sql) return;

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
  createPost,
  editPost,
  getPostBySlug,
  getRecentPosts,
  getUser,
};
