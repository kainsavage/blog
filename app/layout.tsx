import '@mantine/core/styles.css';
import './globals.css';
import './prism.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { ReactNode } from 'react';
import AppShell from '@/components/AppShell';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Teamclerks Blog',
  description: 'Teamclerks Blog',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <script type="text/javascript" src="/scripts/prism.js" async />
        <title>Teamclerks Blog</title>
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <MantineProvider theme={theme}>
            <AppShell>{children}</AppShell>
          </MantineProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
