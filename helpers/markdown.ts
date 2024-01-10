import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';

async function md2html(input: string) {
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(input);

  return processedContent.toString();
}

export { md2html };
