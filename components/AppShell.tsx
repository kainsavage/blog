'use client';

import { AppShell } from '@mantine/core';
import { ReactNode } from 'react';
import NavBar from '@/components/Navbar';
import { useDisclosure } from '@mantine/hooks';
import { Burger, Group } from '@mantine/core';
import Link from 'next/link';

export default function TeamclerksAppShell({
  children,
}: {
  children: ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      footer={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { base: 200, md: 300, lg: 400 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      aside={{
        width: 300,
        breakpoint: 'md',
        collapsed: { desktop: false, mobile: true },
      }}
      className="min-w-full"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Link href="/" className="text-3xl">
            Teamclerks Blog
          </Link>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md" className="shadow-2xl md:shadow-none !p-0">
        <NavBar toggle={toggle} />
      </AppShell.Navbar>
      <AppShell.Main className="flex">{children}</AppShell.Main>
      {/*<AppShell.Footer p="md">Why do I not see a footer?</AppShell.Footer>*/}
    </AppShell>
  );
}
