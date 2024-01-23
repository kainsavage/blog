import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import * as cheerio from 'cheerio';
// import Prism from 'prismjs';
// import loadLanguages from 'prismjs/components/index';
import Prism from '@/components/prism';
import { decode } from 'html-entities';

/**
 * Converts markdown to html using remark and rehype, and converts code blocks to syntax highlighted
 * code blocks using Prism. This is suitable for calling during SSR.
 */
async function md2html(input: string) {
  // loadLanguages(['typescript']);
  const processedContent = (
    await unified()
      .use(remarkParse)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify)
      .process(input)
  ).toString();

  // TODO: this section is required because PrismJS has not yet been updated to be a processor for
  //  unified. Once it has been updated, this section can be removed.
  const $ = cheerio.load(processedContent);
  const $codes = $('code[class^=language]');
  if ($codes.length) {
    $codes.each(function () {
      const $code = $(this);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const lang = $code.attr('class').replace('language-', '');
      if (Prism.languages[lang]) {
        const code = decode($code.html());
        $code.html(Prism.highlight(code, Prism.languages[lang], lang));
      } else {
        console.warn(
          `Code block language '${lang}' not supported; not highlighting`,
        );
      }
      $code.parent('pre').addClass(`language-${lang}`);
      // This has to be added for... reasons?
      $code.parent('pre').attr('tabindex', '0');
    });
  }

  return $('body').html()!.trim();
}

export { md2html };
