'use client';

import { Post } from '@/helpers/db';
import slugs from '@/helpers/slugs';
import PostedDate from '@/components/PostedDate';
import { Pill } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getHeroThumbnailUrl } from '@/helpers/images';

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard(props: PostCardProps) {
  const router = useRouter();

  return (
    <div
      className={`z-[120] shadow-2xl shadow-gray-950 transition ease-in-out hover:md:scale-105 rounded-lg border-2 border-transparent ${props.className}`}
    >
      <div
        className="md:max-w-[320px] cursor-pointer"
        onClick={() => router.push(`/post/${slugs.slugify(props.post.title)}`)}
      >
        <div className="rounded-t-lg border-t-2 border-transparent min-w-full h-[205px] md:h-[140px] overflow-hidden">
          <img
            src={getHeroThumbnailUrl(props.post.hero_url, true)}
            alt={`${props.post.title} thumbnail`}
          />
        </div>
        <div className="flex flex-col gap-2 p-4">
          <div className="flex flex-row justify-between">
            <h3 className="text-[1.5rem] font-extrabold text-left cursor-pointer">
              {props.post.title}
            </h3>
          </div>
          <div className="italic text-sm">
            <PostedDate post={props.post} showUpdated={false} />
          </div>
          <div className="pb-2">{props.post.synopsis}</div>
          <div className="flex flex-row gap-2 flex-wrap">
            {props.post.tags.split(',').map((tag) => (
              <Pill
                key={tag}
                disabled
                className="!cursor-auto border-[1px] border-tan-2 !text-[var(--mantine-color-tan-3)]"
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
