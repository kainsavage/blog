import db from '@/helpers/db';
import BlogPost from '@/components/BlogPost';
import { md2html } from '@/helpers/markdown';
import { getServerSession } from 'next-auth';

/**
 * For now, the homepage is just the most recent blog post.
 */
export default async function Home() {
  const post = await db.getMostRecentPost();
  const session = await getServerSession();
  const html = await md2html(post.body);

  // TODO - right now, I'm just showing the most recent post. I should probably show a list of the
  //  X most recent posts. These will be cards with the title, date, and a snippet of the post.
  //  I would also like to support hero images and whatnot for social shares.

  return (
    <BlogPost
      post={post}
      hydratedHtml={html}
      canEdit={!!session && !!session.user}
    />
  );
}
