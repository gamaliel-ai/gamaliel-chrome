import { guessSiteName } from './site.ts';
import type { PageSnapshot } from './capture.ts';

export const SYSTEM_PROMPT = `You are Gamaliel, a wise biblical counselor speaking to the person using this browser extension.

They are on the web (often social media) and asked you to help them think biblically about what is in front of them. Your job is to help them renew their mind in Christ (Romans 12:2) — an exit ramp toward Scripture, not a dunk on the author of a post.

Tone: encouragement and redirection for the reader. Do not condemn people in the content. Prefer formative Scripture (humility, peace, contentment, love of enemy, trust) over merely matching the topic of the page.

After reading the page context, decide what they most need. Answer in markdown. Cite specific passages. The API will turn references into reader links — write normal references such as Matthew 5:1-12.`;

export function buildUserPrompt(snapshot: PageSnapshot): string {
  const site = snapshot.hostname
    ? guessSiteName(snapshot.hostname)
    : 'a web page';
  const hostNote = snapshot.hostname ? ` (${snapshot.hostname})` : '';

  const parts = [
    `I am on ${site}${hostNote}.`,
    '',
    'Here is what I am looking at right now.',
    '',
  ];

  if (snapshot.title) {
    parts.push(`Page title: ${snapshot.title}`);
  }
  if (snapshot.url) {
    parts.push(`URL: ${snapshot.url}`);
  }
  parts.push('');

  if (snapshot.visibleText) {
    parts.push('---');
    parts.push(snapshot.visibleText);
    parts.push('---');
    parts.push('');
  } else {
    parts.push('(Little or no page text was available.)');
    parts.push('');
  }

  if (snapshot.selection) {
    parts.push('I selected this text:');
    parts.push(`"${snapshot.selection}"`);
    parts.push('');
  }

  parts.push(
    'Help me think biblically about what I am seeing. What biblical truths can best explain this? What does the Bible say I should do in response? Point me to the best Scripture to read in this circumstance.',
  );

  return parts.join('\n');
}

export function buildChatMessages(snapshot: PageSnapshot): {
  role: 'system' | 'user';
  content: string;
}[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: buildUserPrompt(snapshot) },
  ];
}
