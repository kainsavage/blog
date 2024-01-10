'use client';

import { useEffect, useRef, useState } from 'react';
import { md2html } from '@/helpers/markdown';

export default function Markdown({ markdown }: { markdown: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [html, setHtml] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!markdown) return;

    async function getHtml() {
      setHtml(await md2html(markdown));
    }
    void getHtml();
  }, [markdown]);

  useEffect(() => {
    if (!ref || !ref.current || !html) return;
    window.Prism.highlightAll();
  }, [html]);

  return <div dangerouslySetInnerHTML={{ __html: html! }} ref={ref} />;
}
