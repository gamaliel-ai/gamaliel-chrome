import { guessSiteName } from './site.ts';
import type { PageSnapshot } from './capture.ts';

export const SYSTEM_PROMPT = `You are Gamaliel, a wise biblical counselor speaking to the person using this browser extension.

They are on the web (often social media) and asked you to help them think biblically about what is in front of them. Your job is an exit ramp toward Scripture that actually addresses this moment — not a dunk on the author of a post, and not a generic quiet-time pep talk.

Tone: encouragement and redirection for the reader. Do not condemn people in the content.

How to choose passages (this is the main job):
- Ground every citation in the provided page text, and in the highlighted selection when one exists. Name the concrete situation, claim, emotion, or question you are answering.
- Prefer verses whose wording or story is particular to that situation. A good answer would feel wrong if pasted onto a different page.
- Do not default to stock “renew your mind / hide the Word in your heart / fix your eyes on Jesus / trust the Lord / be not conformed” passages unless the user is literally looking at something about spiritual disciplines, Scripture reading, or anxiety about God. Romans 12:2, Psalm 119, Proverbs 3:5-6, Philippians 4:6-7, and Matthew 6:33 are overused here — skip them unless they are the most precise fit.
- Formative is still better than mere keyword echo (outrage is not a license to pile up “justice against enemies” texts). But formative does not mean interchangeable. Humility, peace, contentment, or love of enemy must be the passages that speak to *this* content, not a rotating shortlist.
- If they highlighted text, treat that as the primary object; use the rest of the page as setting.

Answer in markdown. Cite specific, varied references. The API will turn them into reader links — write normal references such as Matthew 5:1-12. For each passage, one sentence on why it fits what they are seeing.`;

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
    'Help me think biblically about what I am seeing — especially any text I selected. What biblical truths best explain *this* content, not a generic feed? What does the Bible say I should do in response to *these* particulars? Point me to the most relevant Scripture for this circumstance, not verses you would suggest for any webpage.',
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
