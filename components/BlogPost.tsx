'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';

export default function BlogPost({ post }: { post: string | undefined }) {
  useEffect(() => {
    if (!post) return;
    Prism.highlightAll();
  }, [post]);

  console.log(post);

  return <div dangerouslySetInnerHTML={{ __html: post! }} />;
}
