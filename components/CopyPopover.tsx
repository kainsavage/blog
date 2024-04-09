'use client';

import { Post } from '@/helpers/db';
import { Popover, Text } from '@mantine/core';
import { ReactNode } from 'react';

interface CopyPopoverProps {
  post: Post;
  toCopy: string;
  children: ReactNode;
}

export default function CopyPopover({
  post,
  toCopy,
  children,
}: CopyPopoverProps) {
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
