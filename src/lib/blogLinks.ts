// Links inside blog text are stored as  [selected words](https://link)
// This file is shared by the admin "Add Links" editor and the blog page.

// Matches [text](url) where url is a website (http/https), an internal page
// (/path), an email (mailto:) or a phone number (tel:).
export const BLOG_LINK_PATTERN = /\[([^\]\n]+)\]\(((?:https?:\/\/|\/|mailto:|tel:)[^)\s]*)\)/g;

export type BlogTextSegment =
  | { type: 'text'; text: string; start: number }
  | { type: 'link'; text: string; href: string; start: number; end: number };

/** Splits stored text into plain parts and link parts, keeping their positions. */
export function parseBlogLinks(text: string): BlogTextSegment[] {
  const segments: BlogTextSegment[] = [];
  const pattern = new RegExp(BLOG_LINK_PATTERN.source, 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', text: text.slice(lastIndex, match.index), start: lastIndex });
    }
    segments.push({ type: 'link', text: match[1], href: match[2], start: match.index, end: pattern.lastIndex });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) segments.push({ type: 'text', text: text.slice(lastIndex), start: lastIndex });
  return segments;
}

/** The same text with link markup removed, e.g. for meta descriptions. */
export const stripBlogLinks = (text: string) =>
  text.replace(new RegExp(BLOG_LINK_PATTERN.source, 'g'), '$1');

/**
 * Cleans a link typed by the admin. Returns null if it isn't usable.
 * "www.site.com" becomes "https://www.site.com"; spaces and brackets are encoded.
 */
export function normalizeBlogLink(input: string): string | null {
  let url = input.trim();
  if (!url) return null;
  // "www.site.com" or "site.com/page" → https://...
  if (/^www\./i.test(url) || /^[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i.test(url)) url = `https://${url}`;
  if (!/^(https?:\/\/|\/|mailto:|tel:)/i.test(url)) return null;
  return url.replace(/\s/g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}
