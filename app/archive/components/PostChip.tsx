'use client';

import { Post } from '@/helpers/db';
import slugs from '@/helpers/slugs';
import Link from 'next/link';
import PostedDate from '@/components/PostedDate';
import { Pill } from '@mantine/core';

export default function PostChip({ post }: { post: Post }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-md border-2 border-[var(--mantine-color-text)]">
      <div>
        <Link href={`/post/${slugs.slugify(post.title)}`}>{post.title}</Link>
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
  );
}
