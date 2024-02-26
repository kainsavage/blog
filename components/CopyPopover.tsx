'use client';

import { Post } from '@/helpers/db';
import { Popover, Text } from '@mantine/core';

export default function CopyPopover({
  post,
  toCopy,
  children,
}: {
  post: Post;
  toCopy: string;
  children: React.ReactNode;
}) {
  return (
    <Popover
      width={200}
      position="bottom-start"
      withArrow
      shadow="md"
      onOpen={() => {
        void navigator.clipboard.writeText(toCopy);
      }}
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <Text size="xs">Copied to clipboard!</Text>
      </Popover.Dropdown>
    </Popover>
  );
}
