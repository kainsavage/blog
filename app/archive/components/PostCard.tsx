'use client';

import { Post } from '@/helpers/db';
import slugs from '@/helpers/slugs';
import PostedDate from '@/components/PostedDate';
import { BackgroundImage, Pill } from '@mantine/core';
import { useRouter } from 'next/navigation';

export default function PostCard({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div
      className={`z-[120] shadow-2xl shadow-gray-950 transition ease-in-out hover:scale-105 rounded-lg border-2 border-transparent ${className}`}
    >
      <div
        className="md:max-w-[320px] cursor-pointer"
        onClick={() => router.push(`/post/${slugs.slugify(post.title)}`)}
      >
        <div className="rounded-t-lg border-t-2 border-transparent min-w-full h-[205px] md:h-[140px] overflow-hidden">
          <BackgroundImage src={post.hero_url} className=" w-full h-[500px]" />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-row justify-between">
            <h3 className="text-[1.5rem] font-extrabold text-left cursor-pointer">
              {post.title}
            </h3>
          </div>
          <div className="italic text-sm">
            <PostedDate post={post} showUpdated={false} />
          </div>
          <div className="pb-2">{post.synopsis}</div>
          <div className="flex flex-row gap-2 flex-wrap">
            {post.tags.split(',').map((tag) => (
              <Pill
                key={tag}
                disabled
                className="border border-[var(--mantine-color-text)] !cursor-auto"
              >
                {tag}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
