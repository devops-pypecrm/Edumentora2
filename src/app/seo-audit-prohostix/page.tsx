import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Internal report — deliberately kept out of search results and the sitemap.
export const metadata: Metadata = {
  title: 'SEO Audit Report',
  description: 'Internal SEO audit of edumentora.com prepared by Prohostix.',
  robots: { index: false, follow: false },
};

type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

type Finding = {
  id: string;
  severity: Severity;
  title: string;
  evidence: string;
  why: string;
  fix: string[];
};

const sevStyle: Record<Severity, string> = {
  Critical: 'bg-red-100 text-red-800 border-red-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  Low: 'bg-blue-100 text-blue-800 border-blue-300',
};

// Semrush resource_rank_history, database "in" (India), target edumentora.com.
const trend = [
  { m: 'Jul 2025', kw: 3, tr: 14 },
  { m: 'Aug 2025', kw: 2, tr: 0 },
  { m: 'Sep–Nov 2025', kw: 3, tr: 0 },
  { m: 'Dec 2025', kw: 9, tr: 56 },
  { m: 'Jan 2026', kw: 9, tr: 56 },
  { m: 'Feb 2026', kw: 13, tr: 55 },
  { m: 'Mar 2026', kw: 12, tr: 130 },
  { m: 'Apr 2026', kw: 11, tr: 20 },
  { m: 'May 2026', kw: 12, tr: 20 },
  { m: 'Jun 2026', kw: 15, tr: 30 },
  { m: 'Jul 2026', kw: 18, tr: 31 },
  { m: 'Aug 2026', kw: 17, tr: 12 },
  { m: 'Sep 2026', kw: 17, tr: 12 },
];

const keywords = [
  { k: 'credit transfer university', pos: 6, vol: 480, url: 'edumentora.com/category/credit-transfer/', note: 'Old WordPress-style URL, apex domain, not in the current site' },
  { k: 'b tech transfer certificate', pos: 5, vol: 210, url: 'www.edumentora.com/b-tech-credit-transfer', note: 'Ranks, but the page is not about "transfer certificate"' },
  { k: 'btech credit transfer', pos: 12, vol: 260, url: 'edumentora.com/b-tech-credit-transfer-thiruvananthapuram/', note: 'Wrong page ranking — a city page beats the main B.Tech page' },
  { k: 'btech credit transfer', pos: 38, vol: 260, url: 'edumentora.com/b-tech-credit-transfer/', note: 'Same keyword, 4 more URL variants (apex, trailing slash, /btech-…-in-kochi/, kannur)' },
  { k: 'credit transfer university in kerala', pos: 49, vol: 140, url: 'www.edumentora.com/b-tech-credit-transfer', note: 'Two URLs compete (also /…-kannur at 81)' },
  { k: 'credit transfer degree', pos: 63, vol: 170, url: 'edumentora.com/b-tech-credit-transfer', note: 'Apex-domain copy' },
  { k: 'edumentr (brand typo)', pos: 42, vol: 140, url: 'www.edumentora.com/', note: 'Brand search is rising (trend 0.01 → 1.00) but site sits at 42' },
];

const findings: Finding[] = [
  {
    id: 'C1',
    severity: 'Critical',
    title: 'Apex (edumentora.com) and www are both indexed — no redirect or enforced canonical host',
    evidence:
      'Semrush lists the same pages under both hosts: edumentora.com/b-tech-credit-transfer and www.edumentora.com/b-tech-credit-transfer, plus edumentora.com/about-us, /ug-credit-transfer/ and /b-tech-credit-transfer-kannur on the bare domain. next.config.ts has no redirects()/host rule, and middleware.ts only matches /admin. Canonicals are relative ("/b-tech-credit-transfer") and resolve against metadataBase, so a page served on the apex host canonicalises to www only if Google reads that tag — it is a hint, not a guarantee.',
    why: 'Every URL exists twice. Links, crawl budget and ranking signals are split, and Google chooses between the copies unpredictably. This is a classic cause of "rankings keep sliding" after a rebuild.',
    fix: [
      'At the host/CDN level (Vercel/Nginx/Cloudflare), 301 edumentora.com/* → https://www.edumentora.com/* for every path. Also force http → https.',
      'Add the same rule in next.config.ts as a safety net: redirects() with has: [{ type: "host", value: "edumentora.com" }] → destination https://www.edumentora.com/:path*, permanent: true.',
      'In Google Search Console, verify both the Domain property and URL-prefix www property, then check Pages → "Duplicate, Google chose different canonical".',
    ],
  },
  {
    id: 'C2',
    severity: 'Critical',
    title: 'Old site URLs that still rank are not redirected to their new equivalents',
    evidence:
      'Semrush shows ranking URLs that do not exist in this codebase: /category/credit-transfer/ (the #1 traffic page — 14 of 32 visits, position 6 for "credit transfer university"), /btech-credit-transfer-in-kochi/ (the current page is /b-tech-credit-transfer-in-kochi) and trailing-slash variants of every page. There is no redirects() config and no matching routes, so these return 404.',
    why: 'The site clearly moved from a previous CMS. Pages that earned rankings now 404, so their authority is lost and Google is dropping them over time — this lines up with the traffic fall from 130 (Mar 2026) to 12 (Sep 2026).',
    fix: [
      '301 /category/credit-transfer → /b-tech-credit-transfer (or a dedicated /credit-transfer hub) and /btech-credit-transfer-in-kochi → /b-tech-credit-transfer-in-kochi.',
      'Export the old site\'s URL list (Search Console → Pages, Wayback Machine, old sitemap, Semrush backlinks) and map every URL that has traffic or backlinks to its closest live page in a redirects() array.',
      'Next.js strips trailing slashes by default with a 308, so confirm trailing-slash URLs resolve in one hop and not via a chain.',
    ],
  },
  {
    id: 'C3',
    severity: 'Critical',
    title: 'Primary navigation is not in the server-rendered HTML',
    evidence:
      'components/Header.tsx is a client component. navItems starts as [] and is filled by a useEffect that calls fetch("/api/navigation") after hydration. The initial HTML therefore contains no menu links (only the logo, login and contact buttons).',
    why: 'Crawlers get the page with no site-wide internal links in the HTML. Google can render JS, but rendering is deferred and unreliable, and other engines/AI crawlers (Bing, ChatGPT, Perplexity) mostly do not. The main B.Tech, UG, PG, Diploma, Universities and Blog pages lose their strongest internal links.',
    fix: [
      'Make Header a server component (or pass navigation in as props from the layout, fetched on the server with revalidate) and render the links directly. Keep only dropdown/scroll behaviour in a small client child.',
      'Render fallbackNavLinks in the initial state instead of an empty array so there is always crawlable HTML.',
      'Do the same check for Footer.tsx, ProgramsSection.tsx and UniversitiesSection.tsx (all "use client").',
    ],
  },
  {
    id: 'H1',
    severity: 'High',
    title: 'Homepage <h1> is a typewriter animation that deletes and rewrites its own text',
    evidence:
      'Hero.tsx: <h1> contains LoopingTypewriterText ("Without Starting Over, Continue Your" + B.Tech / UG / PG / Diploma, typed and deleted in a loop). The server HTML contains little or none of the text, and the visible text changes every few seconds. No target keyword (credit transfer, Kerala) is in the h1.',
    why: 'The most important on-page element for the homepage is empty or unstable for crawlers and has no keyword. The keywords appear only in a decorative paragraph below.',
    fix: [
      'Use a static, server-rendered h1 such as "Credit Transfer Institute in Kerala — Resume Your B.Tech, UG, PG or Diploma".',
      'Keep the animation as a visual-only element (aria-hidden) outside the h1.',
    ],
  },
  {
    id: 'H2',
    severity: 'High',
    title: 'Heading structure is broken on almost every inner page',
    evidence:
      'Headings are built only through PageBanner. The 14 city pages (Alappuzha, Idukki, Kochi, Kannur, Kasaragod, Kollam, Kottayam, Kozhikode, Malappuram, Palakkad, Pathanamthitta, Thiruvananthapuram, Thrissur, Wayanad) contain zero <h2> tags — the body is 2–3 plain paragraphs. UG/PG/Diploma have one h2 each. Only /b-tech-credit-transfer-ernakulam has a real structure (7 h2, FAQ schema).',
    why: 'No subtopic headings means no structure for Google to extract sections, no featured-snippet chance and nothing for long-tail queries ("documents needed", "eligibility", "fees", "colleges in <city>") to match.',
    fix: [
      'Give each page one h1 and 4–6 keyword-led h2 sections: what it is, eligibility, documents, process, universities, fees, FAQ.',
      'Use the Ernakulam page as the template — it is the only one with this structure.',
    ],
  },
  {
    id: 'H3',
    severity: 'High',
    title: 'Fifteen near-duplicate city pages with thin content (doorway-page pattern)',
    evidence:
      'City pages have 328–814 words total including markup. Pages share the same layout, banner, image block and enquiry form, and the copy follows one template with the city name swapped. Titles are formulaic ("B Tech Credit Transfer Wayanad"), the first sentences repeat the city name 4–6 times, and descriptions are generic one-liners. Kannur also uses /wilp-hero.png (a generic image) with alt "Credit Transfer Student in Kannur".',
    why: 'Google\'s spam and helpful-content systems demote sets of pages that only swap a place name. Because each of these pages targets "btech credit transfer" it also causes keyword cannibalisation — Semrush shows /…-thiruvananthapuram outranking the main B.Tech page for "btech credit transfer".',
    fix: [
      'Either write genuinely local content for each city (nearby colleges, local dropout reasons, centre/office distance, local student stories, local FAQs; 800+ words) or merge the weakest pages into the main B.Tech page and 301 them.',
      'Prioritise Kochi/Ernakulam, Thiruvananthapuram, Kozhikode, Thrissur (your two offices are Kozhikode and Kochi).',
      'Merge /b-tech-credit-transfer-in-kochi and /b-tech-credit-transfer-ernakulam — they target the same intent and compete with each other. Keep one and redirect the other.',
      'Add the city name to the descriptions in a natural way with a call to action; remove the repeated city name stuffing in the first paragraph.',
    ],
  },
  {
    id: 'H4',
    severity: 'High',
    title: 'Keyword cannibalisation: the right page is not the one ranking',
    evidence:
      'For "btech credit transfer" Semrush returns six different URLs (city pages, kochi variants, main page). For "credit transfer university in kerala" the main page (49) and Kannur page (81) both appear. For "credit transfer degree", /b-tech-credit-transfer (63) and /ug-credit-transfer (86) both appear.',
    why: 'Google cannot pick a single authoritative page, so none of them reaches page 1.',
    fix: [
      'Assign one primary keyword per URL (main B.Tech page = "btech credit transfer"; /ug-credit-transfer = "ug credit transfer"; etc.) and write titles/h1s accordingly.',
      'Link from every city page to the main B.Tech page with keyword anchor text, and not the other way around only.',
    ],
  },
  {
    id: 'H5',
    severity: 'High',
    title: 'Title tags and meta descriptions are weak and inconsistent',
    evidence:
      'Home title: "Credit Transfer Institute in Kerala | Edumentora" (set with title.absolute). City pages: "B Tech Credit Transfer Kannur | Edumentora". Several titles lack the Kerala qualifier and any benefit (e.g. "Gallery | Edumentora", "Blog | Edumentora", "Notifications | Edumentora", "Programmes | Edumentora"). Descriptions on many pages are 60–90 characters of generic copy ("Stay on track with dependable credit transfer support in Wayanad."). The layout fallback description is a single short sentence.',
    why: 'Titles and snippets drive both relevance and click-through rate. Low CTR is itself a signal that pushes rankings down.',
    fix: [
      'Titles: 50–60 chars, keyword first, e.g. "B.Tech Credit Transfer in Kerala – Resume Your Degree | Edumentora".',
      'Descriptions: 140–155 chars with a benefit and a call to action ("Free eligibility check").',
      'Use unique titles for blog posts and universities (they are generated from the DB — add a title/meta field in the admin so editors can control them).',
    ],
  },
  {
    id: 'H6',
    severity: 'High',
    title: 'Performance: 80 MB of static assets, huge PNGs, videos in /public, and plain <img> tags',
    evidence:
      'public/ is 80 MB. Many PNGs are over 500 KB (hero-image.png, btech-credit-transfer.png, btech_transfer_*.png, about-*.png, university images). Multiple raw .mp4 files sit in public/videos (some with names like "vidssave.com student testimonial 720P.mp4", i.e. downloaded content) and bg/hero-bg-live.mp4 is in /public (not referenced in the source, so it is dead weight). Raw <img> is used in Hero, Header, Footer, StatsSection, TestimonialSection, GalleryImage and HomeGalleryClient, bypassing next/image optimisation. Hero preloads every carousel slide in a hidden <div> and the hero is min-h-[100dvh] with animated content. The blog pages use unoptimized images.',
    why: 'Core Web Vitals (LCP, CLS, INP) are a ranking factor and Kerala traffic is heavily mobile on slower networks. The above-the-fold hero is the likely LCP element and is heavy and JavaScript-dependent.',
    fix: [
      'Convert PNGs to WebP/AVIF at the right dimensions (target < 150 KB per image) and use next/image with width/height, sizes and priority on the LCP image only.',
      'Host videos on YouTube/Cloudflare Stream/Bunny rather than /public; use poster images and preload="none"; avoid autoplaying heavy video on mobile.',
      'Lazy-load carousel slides after the first; remove the hidden preload of all slides.',
      'Run PageSpeed Insights / Lighthouse on /, /b-tech-credit-transfer and a city page and record the baseline (not measurable from this sandbox).',
    ],
  },
  {
    id: 'H7',
    severity: 'High',
    title: 'Missing or poor image alt text, including hero slides',
    evidence:
      'Hero.tsx renders the preload copies of every slide with alt="" and decorative doodles with alt="" (acceptable for decoration only). Slide alt text comes from an admin field that may be empty. students-login and other components use alt="". Program images use the generic alt "Program Image" (ProgramFilter.tsx). City pages reuse generic imagery.',
    why: 'Alt text is used by Google Images and as context for the page topic. Generic or empty alts waste a free relevance signal.',
    fix: [
      'Make the alt field mandatory in the hero-carousel admin; use descriptive text ("B.Tech students at <University> campus, Kerala").',
      'Replace "Program Image" with the program name.',
    ],
  },
  {
    id: 'M1',
    severity: 'Medium',
    title: 'Structured data is partial and duplicated',
    evidence:
      'layout.tsx injects EducationalOrganization and WebSite JSON-LD on every page. The homepage adds a second EducationalOrganization (with AggregateRating and up to 20 Review items). FAQPage is only on /b-tech-credit-transfer and Ernakulam. LocalBusiness data for the two offices has no geo coordinates or opening hours. There is no BreadcrumbList on most pages (only blog and university detail pages) and no Course/Article schema on UG/PG/Diploma.',
    why: 'Two Organization entities on the same URL with different properties is ambiguous. Self-served review markup on an organisation\'s own homepage is not eligible for review rich results and carries a manual-action risk if it does not match visible reviews.',
    fix: [
      'Merge the homepage rating into the single layout Organization via @id, or remove the review block unless the same reviews are visibly shown and verifiable.',
      'Add LocalBusiness (or EducationalOrganization with branchOf) for the Kozhikode and Kochi offices with real coordinates, hours and Google Business Profile URLs.',
      'Add BreadcrumbList to all inner pages and FAQPage to UG, PG, Diploma and city pages (using the real visible FAQ text).',
      'Validate in Google\'s Rich Results Test.',
    ],
  },
  {
    id: 'M2',
    severity: 'Medium',
    title: 'Sitemap and robots issues',
    evidence:
      'sitemap.ts lists static routes with no lastModified at all (intentional), includes /notifications (thin, frequently changing) and does not include /refund-policy or /students-login. Blog and university URLs are read from the DB; if the DB is unreachable at build the catch silently ships only static routes. robots.ts disallows only /admin; /api, /students-login and internal search/filter URLs are crawlable. There are three Google verification HTML files in public/ (fine) but llms.txt also lists only a subset of pages.',
    why: 'Sitemaps without dates give Google no freshness hint, and a silent DB failure can remove every blog/university URL from the sitemap without warning.',
    fix: [
      'Add real lastModified dates (git date at build or a "updatedAt" in code) for static pages.',
      'Remove /notifications from the sitemap or noindex it; add /api/ and /students-login to the robots disallow list.',
      'Log an error (or fail the build) if the sitemap DB query fails, so the problem is visible.',
      'Submit the sitemap for both hosts only after the host redirect (C1) is live.',
    ],
  },
  {
    id: 'M3',
    severity: 'Medium',
    title: 'Content is thin and generic where it matters most',
    evidence:
      'The homepage SeoContentSection is three paragraphs that repeat "Credit Transfer Institute in Kerala" 5+ times and is placed at the bottom inside a framer-motion whileInView container (hidden until scrolled). UG, PG and Diploma pages are ~490–610 words total. Blog has few posts, and the only comprehensive page (B.Tech, ~3,250 words in a client component) renders its content from a "use client" file.',
    why: 'Competitors in the Kerala credit-transfer space publish detailed guides (eligibility, universities, fees, documents, timelines). Thin pages cannot compete, and keyword repetition without substance reads as stuffing.',
    fix: [
      'Publish a content calendar: 2–4 posts/month answering real queries ("B.Tech credit transfer eligibility Kerala", "KTU lateral entry vs credit transfer", "documents for credit transfer", "UGC approved universities for credit transfer", "credit transfer fees").',
      'Expand UG/PG/Diploma pages to 1,200+ words each with FAQ schema, tables of universities and fee ranges, and trust signals (UGC/AICTE approval documents).',
      'Convert BTechCreditTransferClient to a server component so the 3,000+ words are in the initial HTML.',
      'Add author names, reviewed-by details and last-updated dates (E-E-A-T).',
    ],
  },
  {
    id: 'M4',
    severity: 'Medium',
    title: 'Open Graph / social previews use only the small favicon',
    evidence:
      'seo.ts sets openGraph.images and twitter.images to /favcon/edumentora_favcon.png for every page and uses twitter card "summary".',
    why: 'No 1200×630 social image means weak link previews on WhatsApp, Facebook and LinkedIn, which is a main sharing channel for this audience; indirect effect on links/CTR.',
    fix: [
      'Create a 1200×630 branded OG image (and per-page ones for blog posts using the cover image) and switch Twitter to summary_large_image.',
    ],
  },
  {
    id: 'M5',
    severity: 'Medium',
    title: 'Internal linking is weak',
    evidence:
      'City pages are linked from LocationsSection, but contextual links between UG/PG/Diploma/B.Tech/city/universities pages are largely absent; blog posts support [label](/path) links but existing posts contain none (per the code comment in blog/[id]/page.tsx). Nav contains duplicate entries ("About" and "About us" both to /about-us).',
    why: 'Internal links pass authority and tell Google which page owns which topic.',
    fix: [
      'Add contextual links with descriptive anchors: city pages → main B.Tech page; blog posts → relevant program pages; university pages → matching program pages; program pages → enquiry.',
      'Add breadcrumbs on all pages (visible + schema) and a "Related pages" block.',
      'Remove the duplicate About link.',
    ],
  },
  {
    id: 'M6',
    severity: 'Medium',
    title: 'Brand and entity signals are fragmented',
    evidence:
      'Naming varies: "Edumentora", "eduMentora", "Edumentora Services LLP", "Edumentora - Credit Transfer Institution in Kerala". Semrush shows brand-typo searches ("edumentr") rising sharply with the site only at position 42. The favicon file is spelled "favcon", the manifest name differs from the site name, and "Mudra Institute of Assessment" (position 27, volume 6,600) is the homepage\'s second-biggest traffic keyword and has no obvious relation to the business.',
    why: 'Inconsistent naming weakens knowledge-panel eligibility and brand search. Ranking for an unrelated high-volume term can bring wrong-intent visits and a high bounce rate.',
    fix: [
      'Pick one canonical brand string ("Edumentora") and use it in titles, schema, manifest and social profiles.',
      'Claim and complete the Google Business Profile for both offices (Kozhikode and Kochi) with the same NAP as the site; collect reviews there.',
      'The phrase is not in the source code, so check the database-driven content (reviews, universities, FAQs, notifications) for why the homepage matches it, and remove it if it is not relevant.',
    ],
  },
  {
    id: 'L1',
    severity: 'Low',
    title: 'Technical hygiene',
    evidence:
      'middleware.ts uses the file convention that is renamed to proxy in newer Next.js versions (project uses next 16.2.10 — verify against node_modules/next/dist/docs once dependencies are installed). The repository root contains scratch files (test-*.js, tsc-err.txt, blogs-output.json, edumentora.db) and several data-seeding scripts. next.config.ts only sets server action limits: no image formats, no headers (security / caching), no compress or redirects configuration. Google verification files and llms.txt are present (good).',
    why: 'None of these directly hurt rankings, but missing cache headers and security headers affect speed and trust, and repo clutter makes deployments riskier.',
    fix: [
      'Add images.formats: ["image/avif","image/webp"], long-lived Cache-Control for /public assets, and standard security headers (HSTS, X-Content-Type-Options, Referrer-Policy).',
      'Remove committed debug files and databases from the repo; keep secrets and DB files out of version control.',
    ],
  },
  {
    id: 'L2',
    severity: 'Low',
    title: 'Backlink profile and off-page signals could not be assessed',
    evidence:
      'The sandbox could not reach www.edumentora.com (network policy blocked the host) and the Semrush backlinks toolkit was not queried in this audit.',
    why: 'Authority from links is a major ranking factor and a drop can come from lost links after the migration.',
    fix: [
      'Run a Semrush/Ahrefs backlink audit: find links pointing at old URLs (these are fixed by C2 redirects), toxic links, and competitor link gaps.',
      'Earn links from university partners, education directories, local news and student communities in Kerala.',
    ],
  },
];

const roadmap = [
  { phase: 'Week 1 — stop the bleeding', items: ['C1 force one canonical host (301 apex → www, http → https)', 'C2 redirect all old/legacy URLs that had traffic or links', 'Submit the corrected sitemap and request re-indexing of the top 10 pages', 'Set up GSC Pages + Performance reports to track recovery'] },
  { phase: 'Weeks 2–3 — fix crawlability', items: ['C3 render navigation/footer on the server', 'H1 static, keyword-bearing homepage h1', 'H2 add h1/h2 structure to UG, PG, Diploma and the city pages', 'H5 rewrite titles and descriptions for the top 20 URLs'] },
  { phase: 'Weeks 3–6 — performance and structure', items: ['H6 compress images, move videos off /public, next/image everywhere', 'H7 alt text pass', 'M1 clean up schema, add LocalBusiness and BreadcrumbList', 'M2 sitemap/robots improvements'] },
  { phase: 'Weeks 4–12 — content and authority', items: ['H3/H4 rewrite or merge the 15 city pages, one primary keyword per URL', 'M3 publish 2–4 guides per month and expand program pages', 'M5 internal linking plan', 'L2 backlink audit and outreach', 'Google Business Profile reviews for both offices'] },
];

function SeverityBadge({ s }: { s: Severity }) {
  return <span className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${sevStyle[s]}`}>{s}</span>;
}

export default function SeoAuditPage() {
  const counts = findings.reduce<Record<Severity, number>>(
    (acc, f) => ({ ...acc, [f.severity]: acc[f.severity] + 1 }),
    { Critical: 0, High: 0, Medium: 0, Low: 0 }
  );
  const maxTr = Math.max(...trend.map((t) => t.tr));

  return (
    <main className="min-h-screen bg-white font-[Poppins] text-[#1a2433]">
      <Header />

      <div className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-20">
        <p className="text-sm font-semibold tracking-widest text-[#F9010D] uppercase mb-2">Prepared by Prohostix · October 2026</p>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#002147] leading-tight mb-4">
          SEO Audit: Why edumentora.com Is Losing Rankings
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          A technical, on-page and content audit of the Edumentora website, with a prioritised list of everything that needs to change.
        </p>

        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-5 mb-10 text-sm leading-relaxed">
          <h2 className="font-bold text-base mb-2">Scope and limits of this audit</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Source code review:</strong> every route, component, metadata function, sitemap, robots, middleware and schema in the repository was read.</li>
            <li><strong>Semrush data:</strong> organic keywords, pages and 12+ month history for edumentora.com (India database).</li>
            <li><strong>Not done:</strong> live crawl, PageSpeed/Core Web Vitals, Search Console and backlink data. The live site could not be reached from the audit environment, so server/CDN settings (redirects, headers) are inferred from the code and from what Semrush has indexed. Items marked as inferred should be confirmed in GSC before fixing.</li>
            <li>Search volumes for this niche are small, so Semrush numbers are a few dozen visits; the trend and the structural issues matter more than the absolute figures.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002147] mb-4">1. Executive summary</h2>
          <p className="mb-3 leading-relaxed">
            Estimated organic traffic peaked in March 2026 (about 130 visits/month) and has fallen to about 12 in August–September 2026, even though the number of ranking keywords has risen from 9 to 17. Visibility is therefore not growing: the site ranks for more terms, but almost all of them sit beyond position 20 and the few that ranked well have been lost.
          </p>
          <p className="mb-3 leading-relaxed">
            The evidence points to a <strong>migration and architecture problem first, a content problem second</strong>:
          </p>
          <ol className="list-decimal pl-6 space-y-1.5 mb-4 leading-relaxed">
            <li>The same pages are indexed on two hostnames, and old URLs that ranked are no longer served (C1, C2).</li>
            <li>The navigation and the main content blocks depend on client-side JavaScript, and the homepage h1 is an animation (C3, H1).</li>
            <li>Fifteen near-identical city pages cannibalise the main B.Tech page and look like doorway pages (H3, H4).</li>
            <li>Pages are slow and heavy (80 MB of assets, raw images/videos), titles and descriptions are generic, and there is little in-depth content (H5, H6, M3).</li>
          </ol>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(counts) as Severity[]).map((s) => (
              <div key={s} className={`rounded-xl border p-4 text-center ${sevStyle[s]}`}>
                <div className="text-3xl font-extrabold">{counts[s]}</div>
                <div className="text-sm font-semibold">{s}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002147] mb-2">2. Ranking trend (Semrush, India)</h2>
          <p className="text-sm text-gray-600 mb-4">Estimated monthly organic traffic. Source: Semrush resource_rank_history, database &quot;in&quot;.</p>
          <div className="space-y-2" role="table" aria-label="Estimated monthly organic traffic">
            {trend.map((t) => (
              <div key={t.m} className="flex items-center gap-3 text-sm" role="row">
                <div className="w-28 shrink-0 text-gray-600">{t.m}</div>
                <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden">
                  <div className="h-5 bg-[#002147]" style={{ width: `${Math.max(2, (t.tr / maxTr) * 100)}%` }} />
                </div>
                <div className="w-28 shrink-0 text-right font-semibold">{t.tr} visits · {t.kw} kw</div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">
            Reading: traffic jumped to 130 in March 2026, then dropped about 85% in April and has not recovered. Semrush rank also worsened from about 867k (Mar) to 4.59M (Sep). Last two data points: 17 keywords, 12 visits, only 1 keyword in the top 3.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002147] mb-2">3. What Google currently ranks you for</h2>
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Pos.</th>
                  <th className="p-3">Vol.</th>
                  <th className="p-3">Ranking URL</th>
                  <th className="p-3">Problem</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((r, i) => (
                  <tr key={i} className="border-t border-gray-100 align-top">
                    <td className="p-3 font-medium">{r.k}</td>
                    <td className="p-3">{r.pos}</td>
                    <td className="p-3">{r.vol}</td>
                    <td className="p-3 break-all">{r.url}</td>
                    <td className="p-3">{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-700 mt-4 leading-relaxed">
            Takeaway: the only terms in the top 10 are served by URLs that are either legacy (apex host, /category/…) or not the page you would want to rank. High-intent terms like &quot;b tech credit transfer kerala&quot; and &quot;credit transfer university in kerala&quot; are at 49+.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002147] mb-6">4. Detailed findings</h2>
          <div className="space-y-6">
            {findings.map((f) => (
              <article key={f.id} className="rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-mono text-sm text-gray-500">{f.id}</span>
                  <SeverityBadge s={f.severity} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-[#002147] mb-3">{f.title}</h3>
                <dl className="space-y-3 text-sm md:text-base leading-relaxed">
                  <div>
                    <dt className="font-semibold">Evidence</dt>
                    <dd className="text-gray-700">{f.evidence}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">Why it hurts rankings</dt>
                    <dd className="text-gray-700">{f.why}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold">What to change</dt>
                    <dd>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {f.fix.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002147] mb-4">5. What is already good</h2>
          <ul className="list-disc pl-6 space-y-1.5 leading-relaxed">
            <li>Every public page has a title, description, canonical, Open Graph and Twitter metadata through a shared pageMetadata() helper.</li>
            <li>sitemap.xml and robots.txt exist and reference each other; /admin is protected by middleware and disallowed.</li>
            <li>Organization, WebSite, BlogPosting, Course and BreadcrumbList schema helpers exist; FAQ schema is on the main B.Tech page.</li>
            <li>Google Search Console verification files are in place; an llms.txt file helps AI crawlers.</li>
            <li>Server-rendered Next.js App Router pages with ISR (revalidate = 3600) are a good base once the items above are fixed.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#002147] mb-4">6. Action roadmap</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {roadmap.map((r) => (
              <div key={r.phase} className="rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-[#002147] mb-2">{r.phase}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                  {r.items.map((x, i) => (
                    <li key={i}>{x}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-bold text-[#002147] mb-4">7. How to measure recovery</h2>
          <ul className="list-disc pl-6 space-y-1.5 leading-relaxed">
            <li>Google Search Console: Pages (indexed vs. duplicates), Performance (clicks, impressions, CTR, average position for the 10 core keywords), Core Web Vitals.</li>
            <li>Weekly rank tracking (Semrush Position Tracking) for: btech credit transfer, b tech credit transfer kerala, credit transfer university in kerala, credit transfer institute kerala, plus the 15 city variants.</li>
            <li>Expect redirect and canonical fixes to show within 2–6 weeks, and content/performance gains over 2–4 months.</li>
          </ul>
        </section>
      </div>

      <Footer />
    </main>
  );
}
