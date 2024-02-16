'use client';

import { Post } from '@/helpers/db';
import Markdown from '@/components/Markdown';
import PostBody from '@/components/PostBody';
import { Popover, Text } from '@mantine/core';
import slugs from '@/helpers/slugs';
import PostedDate from '@/components/PostedDate';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';

export default function BlogPost({
  post,
  canEdit = false,
  hydratedHtml,
  showImage = false,
}: {
  post: Post;
  canEdit?: boolean;
  hydratedHtml?: string;
  showImage?: boolean;
}) {
  return (
    <div className="flex-col flex-grow">
      {showImage && (
        <img
          src={post.hero_url}
          alt={post.synopsis}
          fetchPriority="low"
          loading="lazy"
          decoding="async"
        />
      )}
      <div className="flex flex-row justify-between">
        <Popover
          width={200}
          position="bottom-start"
          withArrow
          shadow="md"
          onOpen={() => {
            void navigator.clipboard.writeText(
              `${window.location.origin}/post/${slugs.slugify(post.title)}`,
            );
          }}
        >
          <Popover.Target>
            <h3 className="text-[2rem] font-extrabold text-left cursor-pointer">
              {post.title}
            </h3>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs">Copied to clipboard!</Text>
          </Popover.Dropdown>
        </Popover>
        {canEdit && (
          <Link href={`/post/edit?id=${post.id}`} className="ml-3">
            <FontAwesomeIcon icon={faPenToSquare} />
          </Link>
        )}
      </div>
      <div className="italic text-sm">
        <PostedDate post={post} />
      </div>
      {hydratedHtml ? (
        <PostBody html={hydratedHtml} />
      ) : (
        <Markdown markdown={post.body} />
      )}
    </div>
  );
}
