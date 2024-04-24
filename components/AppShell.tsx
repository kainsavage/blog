'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import { Group } from '@mantine/core';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TeamclerksAppShell({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const { status } = useSession();
  const authenticated = status === 'authenticated';

  async function createPost() {
    if (authenticated) {
      const resp = await fetch('/api/post', {
        method: 'POST',
      });
      if (resp.ok) {
        const { id } = await resp.json();
        router.push(`/post/edit?id=${id}`);
      }
    }
  }

  return (
    <AppShell
      header={{ height: { base: 140, md: 80, lg: 80 } }}
      footer={{ height: { base: 60, md: 70, lg: 80 } }}
      className="max-w-[1024px] mx-auto"
      withBorder={false}
    >
      <AppShell.Header
        px={8}
        className="hidden md:flex max-w-[1024px] mx-auto flex-col md:flex-row md:justify-between"
      >
        <Group className="mx-auto md:mx-0 py-4 md:py-0">
          <Logo />
        </Group>
        <Group>
          <div className="flex justify-between gap-4 w-full md:w-fit">
            {authenticated && (
              <Link href="#" onClick={createPost}>
                New Post
              </Link>
            )}
            <Link href={{ pathname: '/about' }}>About</Link>
            <Link href={{ pathname: '/archive' }}>Archive</Link>
            <Link href={{ pathname: 'mailto:kain@teamclerks.net' }}>
              Contact
            </Link>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Main className="flex flex-col">
        <div className="flex flex-col px-4">
          <Group className="mt-[-140px] flex md:!hidden mx-auto py-4">
            <Logo />
          </Group>
          <Group>
            <div className="flex md:!hidden justify-between gap-4 w-full pb-2">
              <Link href={{ pathname: '/about' }}>About</Link>
              <Link href={{ pathname: '/archive' }}>Archive</Link>
              <Link href={{ pathname: 'mailto:kain@teamclerks.net' }}>
                Contact
              </Link>
            </div>
          </Group>
          {children}
        </div>
      </AppShell.Main>
      {/*<AppShell.Footer className="mx-auto max-w-[1024px]">*/}
      {/*  Footer content */}
      {/*</AppShell.Footer>*/}
    </AppShell>
  );
}
