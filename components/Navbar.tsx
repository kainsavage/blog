import slugs from '@/helpers/slugs';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Post } from '@/helpers/db';
import { ReactNode, Suspense } from 'react';
import Link from 'next/link';
import { Skeleton } from '@mantine/core';
import { fq } from '@/helpers/fetch';

export default function NavBar({ toggle }: { toggle: () => void }) {
  return (
    <div className="flex flex-grow flex-col p-3">
      <h3 className="text-xl py-4">Recent Posts</h3>
      <ul className="flex flex-col gap-1">
        <Suspense fallback={<LoadingNavItems />}>
          <NavItems toggle={toggle} />
        </Suspense>
      </ul>
    </div>
  );
}

function LoadingNavItems() {
  return (
    <>
      {Array.from({ length: 20 }).map((_, i) => (
        <NavItem key={i} className="py-1">
          <Skeleton height={25} />
        </NavItem>
      ))}
    </>
  );
}

function NavItems({ toggle }: { toggle: () => void }) {
  const { data } = useSuspenseQuery({
    queryKey: ['recent-posts'],
    queryFn: () => fetch(fq`/api/posts/recent`).then((res) => res.json()),
  });

  return (
    <>
      {data.map((post: Post) => (
        <NavItem key={post.id}>
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
        </NavItem>
      ))}
    </>
  );
}

function NavItem({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <li className={`flex flew-row justify-between ${className}`}>{children}</li>
  );
}
