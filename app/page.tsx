import db from '@/helpers/db';
import PostCard from '@/app/archive/components/PostCard';
import { Title } from '@mantine/core';

/**
 * For now, the homepage is just the most recent blog post.
 */
export default async function Home() {
  const posts = await db.getRecentPosts();

  // TODO - right now, I'm just showing the most recent post. I should probably show a list of the
  //  X most recent posts. These will be cards with the title, date, and a snippet of the post.
  //  I would also like to support hero images and whatnot for social shares.

  return (
    <div>
      <div className="mb-2 p-2 w-full flex flex-row">
        <div className="bg-gradient-to-r from-[var(--mantine-color-body)] to-black flex-grow" />
        <div className="mx-auto bg-black">
          <img
            src="/images/hero.png"
            alt="Clerks hero image"
            height={300}
            width={300}
            fetchPriority="low"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="bg-gradient-to-r from-black to-[var(--mantine-color-body)] flex-grow" />
      </div>
      <Title>Featured Posts</Title>
      <div className="grid md:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard className="mt-4 md:mt-0" post={post} key={post.id} />
        ))}
      </div>
    </div>
  );
}
