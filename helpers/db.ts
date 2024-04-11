import slugs from '@/helpers/slugs';
import bcrypt from 'bcrypt';
import { User as AuthUser } from 'next-auth';
import { sql } from '@vercel/postgres';

export type Post = {
  id: number;
  title: string;
  body: string;
  synopsis: string;
  tags: string;
  hero_url: string;
  // TODO add more hero data:
  //  hero_type: string;
  //  hero_width: number;
  //  hero_height: number;
  created_at: Date;
  updated_at?: Date;
  is_draft: boolean;
  published_at?: Date;
};

/**
 * Get all posts from the database.
 */
async function getAllPosts(): Promise<Post[]> {
  if (!sql) return [];

  // TODO - this should be a published_date, not created_at.
  const res =
    await sql`SELECT * from posts WHERE is_draft = FALSE ORDER BY created_at DESC`;
  return res.rows as Post[];
}

/**
 * Get the most recent post from the database.
 */
async function getMostRecentPost(): Promise<Post> {
  if (!sql) return {} as Post;

  // TODO - this should be a published_date, not created_at.
  const res =
    await sql`SELECT * from posts WHERE is_draft = FALSE ORDER BY created_at DESC LIMIT 1`;
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
async function createPost(
  title: string,
  body: string,
  synopsis: string,
  tags: string,
  hero_url: string,
) {
  if (!sql) return;

  const resp =
    await sql`INSERT INTO posts (title, body, synopsis, tags, hero_url) VALUES (${title}, ${body}, ${synopsis}, ${tags}, ${hero_url})`;

  if (resp.rowCount < 1) throw new Error('Failed to create post');
}

/**
 * Edit a post by its id.
 */
async function editPost(
  id: number,
  title: string,
  body: string,
  synopsis: string,
  tags: string,
  hero_url: string,
) {
  if (!sql) return;

  const resp = await sql`UPDATE posts SET 
       title = ${title},
       body = ${body},
       synopsis = ${synopsis},
       tags = ${tags},
       hero_url = ${hero_url},
       updated_at = NOW() 
     WHERE id = ${id}`;

  if (resp.rowCount < 1) throw new Error('Failed to edit post');
}

/**
 * Publish a post by its id.
 */
async function publishPost(id: number) {
  if (!sql) return;

  const resp =
    await sql`UPDATE posts SET is_draft = FALSE, published_at = NOW() WHERE id = ${id}`;

  if (resp.rowCount < 1) throw new Error('Failed to publish post');
}

/**
 * Get a post by its slug. Converts the slug to a title and then queries the database for the post.
 * This will return a post if it exists - hide the post if it is a draft.
 */
async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const title = slugs.unslugify(slug).toLowerCase();
  const res = await sql`SELECT * from posts where LOWER(title) = ${title}`;

  return res.rows ? (res.rows[0] as Post) : undefined;
}

async function getRecentPosts(): Promise<Post[]> {
  if (!sql) return [];

  const res =
    await sql`SELECT * from posts WHERE is_draft = FALSE ORDER BY published_at DESC LIMIT 3`;
  return res.rows as Post[];
}

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

  let authorized;
  try {
    const saltedPasswordToCheck = await bcrypt.hash(password, 10);
    authorized = await bcrypt.compare(password, saltedPasswordToCheck);
  } catch (_) {
    authorized = false;
  }
  if (!authorized) throw new Error('Invalid username or password.');

  return {
    id: res.rows[0].id.toString(),
    name: res.rows[0].username,
  };
}

export default {
  getAllPosts,
  getMostRecentPost,
  publishPost,
  getPost,
  createPost,
  editPost,
  getPostBySlug,
  getRecentPosts,
  getUser,
};
