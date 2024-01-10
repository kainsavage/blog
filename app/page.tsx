import Markdown from '@/components/Markdown';

export default function Home() {
  const markdown = `# Welcome to my MDX page!
 
This is some **bold** and _italics_ text.
 
This is a list in markdown:
 
- One
- Two
- Three
 
Checkout my React component:

\`\`\`ts
function bigTest(): void {
  const test = 'test';
} 
\`\`\`
\`\`\`Java
public static void main(String[] args) {
  System.out.println("Hello World");
}
\`\`\`
`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Markdown markdown={markdown} />
    </main>
  );
}
