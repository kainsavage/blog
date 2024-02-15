import Markdown from '@/components/Markdown';
import { Metadata } from 'next';

const years = new Date().getFullYear() - 2006;

const markdown = `
## About This Blog

### Who are you?

[kain](https://bsky.app/profile/teamclerks.net)

I am a software engineer of ${years} years who enjoys writing from time to time. I love playing
with new technologies and learning new things. I am a big fan of open source software and I try to
contribute to it when I can. Every couple of years I end up trying out a technology that is new to
me by rewriting my personal blog. This time I am using Next.js and giving the
[Hobby tier of Vercel](https://vercel.com/docs/accounts/plans/hobby) a try. So far, I am very happy
with how it is working out. DNS management is simple and the deployment process is a breeze. I like
how I did not have to set up any of my Github Actions: Vercel handled that for me.

### What do you write about?

I write about whatever I feel like writing about. I have written about software development, video
games, Dodger baseball, politics, and more. I have a lot of interests and I like to write about any
of them when I feel like it. I am not trying to make money off of this blog, so I do not feel
obligated to write about anything in particular.

In fact, I am exploring BlueSky (pronounced: \`/bluːskiː/\`) as a mechanism for writing and
sharing. It feels like a good fit for getting my writing out there, and gives me a short-form way
to share my thoughts and ideas, and link back to more long-form content here. Interestingly,
BlueSky is a social media platform with a more self-identifying form of verification. That is, I
state that I am \`kain@teamclerks.net\` on their platform and they ask me to set some DNS records
to prove that assertion. I think that is a pretty cool way to do it. 
`;

export const metadata: Metadata = {
  title: 'About | Teamclerks',
};

export default async function About() {
  return <Markdown markdown={markdown} />;
}
