'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import { Group } from '@mantine/core';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function TeamclerksAppShell({
  children,
}: {
  children: ReactNode;
}) {
  const session = useSession();
  const authenticated = session.status === 'authenticated';

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      footer={{ height: { base: 60, md: 70, lg: 80 } }}
      className="max-w-[1024px] mx-auto"
      withBorder={false}
    >
      <AppShell.Header className="max-w-[1024px] mx-auto flex flex-row justify-between">
        <Group h="100%">
          <Link href="/" className="text-3xl no-underline pl-1 md:pr-0">
            Teamclerks Blog
          </Link>
        </Group>
        <Group h="100%">
          {authenticated && (
            <Link href="/post/edit" className="pr-1 md:pr-0">
              New Post
            </Link>
          )}
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
      {/*<AppShell.Footer className="mx-auto max-w-[1024px]">*/}
      {/*  Footer content */}
      {/*</AppShell.Footer>*/}
    </AppShell>
  );
}
