'use client';

import { Post } from '@/helpers/db';
import Markdown from '@/components/Markdown';
import PostBody from '@/components/PostBody';
import { Popover, Text } from '@mantine/core';
import { useRouter } from 'next/navigation';
import slugs from '@/helpers/slugs';
import PostedDate from '@/components/PostedDate';

export default function BlogPost({
  post,
  canEdit = false,
  hydratedHtml,
}: {
  post: Post;
  canEdit?: boolean;
  hydratedHtml?: string;
}) {
  const router = useRouter();

  return (
    <div className="flex-col flex-grow">
      <div className="flex-row">
        <Popover
          width={200}
          position="bottom-start"
          withArrow
          shadow="md"
          onOpen={() => {
            if (canEdit) {
              void router.push(`/post/edit?id=${post.id}`);
            } else {
              void navigator.clipboard.writeText(
                `${window.location.origin}/post/${slugs.slugify(post.title)}`,
              );
            }
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
