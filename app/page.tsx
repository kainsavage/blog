import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';

/**
 * For now, the homepage is just the most recent blog post.
 */
export default async function Home() {
  const post = await db.getMostRecentPost();

  return <BlogPost post={post} />;
}
