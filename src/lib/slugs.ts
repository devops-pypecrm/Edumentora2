// Readable URL names (slugs) for blog posts and universities.
// The key is the database ID, the value is the name used in the URL.
// Old ID-based URLs still work and permanently redirect to these names.
// To give another blog or university a readable URL, add a line here.

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
};

const invert = (map: Record<string, string>) =>
  Object.fromEntries(Object.entries(map).map(([id, slug]) => [slug, id]));

const BLOG_IDS = invert(BLOG_SLUGS);
const UNIVERSITY_IDS = invert(UNIVERSITY_SLUGS);

/** URL path for a blog post: the readable name if it has one, otherwise its ID. */
export const blogPath = (id: string) => `/blog/${BLOG_SLUGS[id] ?? id}`;

/** URL path for a university: the readable name if it has one, otherwise its ID. */
export const universityPath = (id: string) => `/universities/${UNIVERSITY_SLUGS[id] ?? id}`;

/** Turns the URL segment (readable name or ID) back into the database ID. */
export const resolveBlogId = (segment: string) => BLOG_IDS[segment] ?? segment;

/** Turns the URL segment (readable name or ID) back into the database ID. */
export const resolveUniversityId = (segment: string) => UNIVERSITY_IDS[segment] ?? segment;
