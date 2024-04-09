import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './globals.css';
import './prism.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { theme } from '@/components/Theme';
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

export async function generateMetadata(): Promise<Metadata> {
  const title = `TeamClerks`;

  return {
    title: title,
    openGraph: {
      title: title,
      type: 'website',
      url: `https://blog.teamclerks.net`,
      description: 'The TeamClerks blog',
      locale: 'en_US',
      siteName: 'TeamClerks Blog',
      emails: ['kain@teamclerks.net'],
      countryName: 'United States',
    },
    metadataBase: new URL('https://blog.teamclerks.net'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" forceColorScheme="dark" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <meta property="twitter:domain" content="blog.teamclerks.net" />
        <script type="text/javascript" src="/scripts/prism.js" async />
      </head>
      <body className={inter.className}>
        <SessionProvider session={session}>
          <ReactQueryProvider>
            <MantineProvider
              theme={theme}
              defaultColorScheme="dark"
              forceColorScheme="dark"
            >
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
