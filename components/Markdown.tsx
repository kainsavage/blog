'use client';

import { useEffect, useState } from 'react';
import { md2html } from '@/helpers/markdown';
import PostBody from '@/components/PostBody';

/**
 * Renders markdown as HTML.
 */
export default function Markdown({ markdown }: { markdown: string }) {
  const [html, setHtml] = useState<string | undefined>(undefined);

  // Process markdown into HTML.
  useEffect(() => {
    if (!markdown) return;
    async function getHtml() {
      setHtml(await md2html(markdown));
    }
    void getHtml();
  }, [markdown]);

  return <PostBody html={html!} />;
}
