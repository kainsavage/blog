import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';

async function md2html(input: string) {
  return String(
    await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypeRaw)
      .process(input),
  );
}

export { md2html };
