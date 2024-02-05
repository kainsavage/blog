import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import './prism.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { ReactNode } from 'react';
import AppShell from '@/components/AppShell';
import { getServerSession } from 'next-auth';
import SessionProvider from '@/providers/SessionProvider';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { Analytics } from '@vercel/analytics/react';
import { Notifications } from '@mantine/notifications';

config.autoAddCss = false;
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
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <MantineProvider theme={theme} defaultColorScheme="dark">
              <Notifications position="top-right" zIndex={1000} />
              <AppShell>{children}</AppShell>
            </MantineProvider>
          </ReactQueryProvider>
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
