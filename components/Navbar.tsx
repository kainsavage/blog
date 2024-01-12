import { Skeleton } from '@mantine/core';
import { Suspense, useEffect, useState } from 'react';
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
    <>
      <h3>Recent Posts</h3>
      <Suspense
        fallback={Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={true}>
              Test
            </Skeleton>
          ))}
      >
        <ul>
          {recentPosts.map((post) => (
            <li
              key={slugs.slugify(post.title)}
              className="flex flew-row justify-between"
            >
              <Link
                href={`/post/${slugs.slugify(post.title)}`}
                onClick={toggle}
              >
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
      </Suspense>
    </>
  );
}
