'use client';

import { Post } from '@/helpers/db';
import slugs from '@/helpers/slugs';
import Link from 'next/link';
import PostedDate from '@/components/PostedDate';
import { Pill } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const session = useSession();
  const canEdit = !!session?.data?.user;

  return (
    <div className="rounded-lg border-2 border-[var(--mantine-color-text)] md:max-w-[320px] overflow-hidden">
      <div
        className="relative min-w-full h-[205px] md:h-[140px] cursor-pointer overflow-hidden"
        onClick={() => router.push(`/post/${slugs.slugify(post.title)}`)}
      >
        <div
          className="transition ease-in-out hover:scale-105 w-full h-[500px]"
          style={{
            backgroundImage: `url(${post.hero_url})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="flex flex-row justify-between">
          <Link href={`/post/${slugs.slugify(post.title)}`}>{post.title}</Link>
          {canEdit && (
            <Link href={`/post/edit?id=${post.id}`} className="ml-3">
              <FontAwesomeIcon icon={faPenToSquare} />
            </Link>
          )}
        </div>
        <div className="italic text-sm">
          <PostedDate post={post} showUpdated={false} />
        </div>
        <div>{post.synopsis}</div>
        <ul className="flex flex-row gap-2">
          {post.tags.split(',').map((tag) => (
            <li key={tag}>
              <Pill
                disabled
                className="border border-[var(--mantine-color-text)] !cursor-auto"
              >
                {tag}
              </Pill>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
