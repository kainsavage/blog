'use client';

import { useEffect, useState } from 'react';
import { md2html } from '@/helpers/markdown';
import BlogPost from '@/components/BlogPost';

export default function Home() {
  const [html, setHtml] = useState<string | undefined>(undefined);
  const markdown = `# Welcome to my MDX page!
 
This is some **bold** and _italics_ text.
 
This is a list in markdown:
 
- One
- Two
- Three
 
Checkout my React component:

\`\`\`TS
function bigTest() {
  const test = 'test';
} 
\`\`\`
`;

  useEffect(() => {
    async function wat() {
      setHtml(await md2html(markdown));
    }
    void wat();
  }, [markdown]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <BlogPost post={html} />
    </main>
  );
}
