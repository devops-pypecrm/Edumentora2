// Readable URL names (slugs) for blog posts and universities.
// The key is the database ID, the value is the name used in the URL.
// Old ID-based URLs still work and permanently redirect to these names.
// Anything not listed here (e.g. a new blog added from the admin panel) gets
// a readable URL made from its title/name automatically.

export const BLOG_SLUGS: Record<string, string> = {
  '6a798b2c3e640d6933a2cdf2': 'what-is-academic-credit-transfer',
  '6a7ac3063f54f002c166061e': 'what-students-should-know-about-btech-credit-transfer',
  '6a7ac48b884d9293cd497181': 'is-btech-credit-transfer-right-for-you',
  '6a7ac6153f54f002c1660622': 'btech-discontinued-after-2-or-3-years',
  '6a7ac7457ad4a7b8426c7662': 'what-happens-after-submitting-documents-for-btech-credit-transfer',
  '6a96c7cc70298b504074e813': 'credit-transfer-vs-lateral-entry',
  '6a96cc0f416eb6a4142d8f31': 'is-btech-credit-transfer-legitimate',
  '6a96cdf054e0b81167d6f584': 'how-are-backlogs-evaluated-for-btech-credit-transfer',
  '6a96cf51a7a47ddbe0c4cd64': 'academic-time-saved-or-lost-btech-credit-transfer',
  '6a97ed55807c703b0d268ed5': 'how-to-choose-the-right-credit-transfer-agency',
};

export const UNIVERSITY_SLUGS: Record<string, string> = {
  '6a679ea1c7da20d58dbec435': 'glocal-university',
  '6a679ea1c7da20d58dbec436': 'arni-university',
  '6a679ea1c7da20d58dbec437': 'maya-devi-university',
  '6a679ea1c7da20d58dbec438': 'manipur-international-university',
  '6a746c8b0795eddde1a2a5e7': 'adamas-university',
  '6a746ff40795eddde1a2a5eb': 'sage-university',
};

/** Turns a title into a URL name, e.g. "Is B.Tech Right?" -> "is-btech-right". */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[.'’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const isObjectId = (value: string) => /^[0-9a-f]{24}$/i.test(value);

const invert = (map: Record<string, string>) =>
  Object.fromEntries(Object.entries(map).map(([id, slug]) => [slug, id]));

const BLOG_IDS = invert(BLOG_SLUGS);
const UNIVERSITY_IDS = invert(UNIVERSITY_SLUGS);

const slugFor = (map: Record<string, string>, id: string, name?: string | null) =>
  map[id] ?? (name && slugify(name)) ?? id;

/** URL path for a blog post, from the list above or made from its title. */
export const blogPath = (id: string, title?: string | null) => `/blog/${slugFor(BLOG_SLUGS, id, title)}`;

/** URL path for a university, from the list above or made from its name. */
export const universityPath = (id: string, name?: string | null) =>
  `/universities/${slugFor(UNIVERSITY_SLUGS, id, name)}`;

/**
 * Turns the URL segment (readable name or old ID) back into the database ID.
 * `loadAll` is only called for names made automatically from a title.
 */
async function resolveId(
  segment: string,
  known: Record<string, string>,
  loadAll: () => Promise<{ id: string; name: string }[]>,
): Promise<string | null> {
  if (known[segment]) return known[segment];
  if (isObjectId(segment)) return segment;
  const items = await loadAll();
  return items.find((item) => slugify(item.name) === segment)?.id ?? null;
}

export const resolveBlogId = (
  segment: string,
  loadAll: () => Promise<{ id: string; name: string }[]>,
) => resolveId(segment, BLOG_IDS, loadAll);

export const resolveUniversityId = (
  segment: string,
  loadAll: () => Promise<{ id: string; name: string }[]>,
) => resolveId(segment, UNIVERSITY_IDS, loadAll);
