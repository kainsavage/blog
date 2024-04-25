import slugs from '@/helpers/slugs';
import bcrypt from 'bcrypt';
import { sql } from '@vercel/postgres';

export type Post = {
  id: number;
  draft_title: string;
  title: string;
  draft_body: string;
  body: string;
  draft_synopsis: string;
  synopsis: string;
  draft_tags: string;
  tags: string;
  draft_hero_url: string;
  hero_url: string;
  draft_blurred_hero_data_url?: string;
  blurred_hero_data_url?: string;
  created_at: Date;
  updated_at?: Date;
  is_draft: boolean;
  published_at?: Date;
};

/**
 * Get all posts from the database.
 */
async function getAllPosts(hideDrafts: boolean) {
  const res = hideDrafts
    ? await sql`SELECT * from posts WHERE is_draft = FALSE ORDER BY COALESCE(published_at, created_at) DESC`
    : await sql`SELECT * from posts ORDER BY COALESCE(published_at, created_at) DESC`;
  return res.rows as Post[];
}

/**
 * Get the most recent post from the database.
 */
async function getMostRecentPost() {
  const res =
    await sql`SELECT * from posts WHERE is_draft = FALSE ORDER BY published_at DESC LIMIT 1`;
  return res.rows[0] as Post;
}

/**
 * Get a post by its id.
 */
async function getPost(id: number) {
  const res = await sql`SELECT * from posts where id = ${id}`;
  return res.rows ? (res.rows[0] as Post) : undefined;
}

/**
 * Create a new post.
 */
async function createPost() {
  const resp = await sql`INSERT INTO posts DEFAULT VALUES RETURNING id`;

  if (resp.rowCount < 1) throw new Error('Failed to create post');

  return resp.rows[0].id as number;
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
  blurred_hero_data_url: string,
) {
  const resp = await sql`UPDATE posts SET 
       draft_title = ${title},
       draft_body = ${body},
       draft_synopsis = ${synopsis},
       draft_tags = ${tags},
       draft_hero_url = ${hero_url},
       draft_blurred_hero_data_url = ${blurred_hero_data_url},
       updated_at = NOW() 
     WHERE id = ${id}`;

  if (resp.rowCount < 1) throw new Error('Failed to edit post');
}

/**
 * Publish a post by its id.
 */
async function publishPost(id: number) {
  const resp = await sql`UPDATE posts 
      SET title = draft_title, 
          synopsis = draft_synopsis,
          tags = draft_tags,
          body = draft_body,
          hero_url = draft_hero_url,
          draft_blurred_hero_data_url = draft_blurred_hero_data_url,
          is_draft = FALSE, 
          published_at = NOW() 
    WHERE id = ${id}`;

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

/**
 * Get the three most recent posts.
 */
async function getRecentPosts() {
  const res =
    await sql`SELECT * from posts WHERE is_draft = FALSE ORDER BY published_at DESC LIMIT 3`;
  return res.rows as Post[];
}

/**
 * Checks that a user exists - does not return the user.
 */
async function getUser(username: string, password: string) {
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
