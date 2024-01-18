import { useEffect, useState } from 'react';
import slugs from '@/helpers/slugs';
import { Post } from '@/helpers/db';
import Link from 'next/link';

export default function NavBar({ toggle }: { toggle: () => void }) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function getRecentPosts() {
      const test = await fetch('/api/posts/recent');
      setRecentPosts(await test.json());
    }
    void getRecentPosts();
  }, []);

  return (
    <div className="bg-gray-100 md:bg-white flex flex-grow flex-col">
      <h3>Recent Posts</h3>
      <ul>
        {recentPosts.map((post) => (
          <li
            key={slugs.slugify(post.title)}
            className="flex flew-row justify-between"
          >
            <Link href={`/post/${slugs.slugify(post.title)}`} onClick={toggle}>
              {post.title}
            </Link>
            <time
              dateTime={
                post.updated_at
                  ? new Date(post.updated_at).toLocaleDateString()
                  : new Date(post.created_at).toLocaleDateString()
              }
              className="italic text-sm"
            >
              {post.updated_at
                ? new Date(post.updated_at).toLocaleDateString()
                : new Date(post.created_at).toLocaleDateString()}
            </time>
          </li>
        ))}
      </ul>
    </div>
  );
}
