'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import { Group } from '@mantine/core';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function TeamclerksAppShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AppShell
      header={{ height: { base: 140, md: 80, lg: 80 } }}
      footer={{ height: { base: 60, md: 70, lg: 80 } }}
      className="max-w-[1024px] mx-auto"
      withBorder={false}
    >
      <AppShell.Header
        px={8}
        className="max-w-[1024px] mx-auto flex flex-col md:flex-row md:justify-between"
      >
        <Group className="mx-auto md:mx-0 py-4 md:py-0">
          <Logo />
        </Group>
        <Group>
          <div className="flex justify-between gap-4 w-full md:w-fit">
            <Link href={{ pathname: '/about' }}>About</Link>
            <Link href={{ pathname: '/archive' }}>Archive</Link>
            <Link href={{ pathname: 'mailto:kain@teamclerks.net' }}>
              Contact
            </Link>
          </div>
        </Group>
      </AppShell.Header>
      <AppShell.Main px={8}>{children}</AppShell.Main>
      {/*<AppShell.Footer className="mx-auto max-w-[1024px]">*/}
      {/*  Footer content */}
      {/*</AppShell.Footer>*/}
    </AppShell>
  );
}
