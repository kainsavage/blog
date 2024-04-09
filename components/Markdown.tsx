'use client';

import { useEffect, useState } from 'react';
import { md2html } from '@/helpers/markdown';
import PostBody from '@/components/PostBody';

interface MarkdownProps {
  markdown: string;
}

/**
 * Renders markdown as HTML in a PostBody. This is a client-rendered component to properly render
 * markdown in the browser when hydration is not available (e.g. when viewing the preview render
 * of a post in the browser).
 */
export default function Markdown({ markdown }: MarkdownProps) {
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
