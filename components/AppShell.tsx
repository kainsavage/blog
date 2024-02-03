'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import { Group } from '@mantine/core';
import Link from 'next/link';

export default function TeamclerksAppShell({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex mx-auto">
      <AppShell
        header={{ height: { base: 60, md: 70, lg: 80 } }}
        footer={{ height: { base: 60, md: 70, lg: 80 } }}
        className="max-w-[1024px]"
        withBorder={false}
      >
        <AppShell.Header className="mx-auto max-w-[1024px] flex flex-row justify-between">
          <Group h="100%">
            <Link href="/" className="text-3xl no-underline pl-1 md:pr-0">
              Teamclerks Blog
            </Link>
          </Group>
          <Group h="100%">
            <Link href="/test" className="pr-1 md:pr-0">
              Wat
            </Link>
          </Group>
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
        {/*<AppShell.Footer className="mx-auto max-w-[1024px]">*/}
        {/*  Footer content */}
        {/*</AppShell.Footer>*/}
      </AppShell>
    </div>
  );
}
