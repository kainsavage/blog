'use client';

import { useEffect, useRef, useState } from 'react';
import { md2html } from '@/helpers/markdown';

export default function Markdown({ markdown }: { markdown: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState<string | undefined>(undefined);

  // Process markdown into HTML.
  useEffect(() => {
    if (!markdown) return;
    async function getHtml() {
      setHtml(await md2html(markdown));
    }
    void getHtml();
  }, [markdown]);

  // Highlight code blocks.
  useEffect(() => {
    if (!ref || !ref.current || !html) return;
    // This feels like a hack, but it works... I guess. Basically, we need to wait for the
    // actual element to be rendered before we can call Prism.highlightAll() on it.
    window.Prism.highlightAllUnder(ref.current);
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: html! }} ref={ref} />;
}
