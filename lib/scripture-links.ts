export const GAMALIEL_APP_ORIGIN = 'https://gamaliel.ai';

/** Turn API-relative /read/… hrefs into absolute Gamaliel reader URLs. */
export function toGamalielHref(href: string): string {
  if (href.startsWith('/read/')) {
    return `${GAMALIEL_APP_ORIGIN}${href}`;
  }
  return href;
}

export function absolutizeGamalielLinks(markdown: string): string {
  return markdown.replace(
    /\]\((\/read\/[^)\s]+)\)/g,
    (_match, path: string) => `](${GAMALIEL_APP_ORIGIN}${path})`,
  );
}
