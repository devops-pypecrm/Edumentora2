import type { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';
import { SITE_URL } from '@/lib/seo';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const STATIC_ROUTES = [
  '',
  '/about-us',
  '/gallery',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/notifications',
  '/programs',
  '/universities',
  '/b-tech-credit-transfer',
  '/diploma-credit-transfer',
  '/pg-credit-transfer',
  '/ug-credit-transfer',
  '/apprenticeship-learning-program',
  '/best-b-tech-credit-transfer-services-in-kerala-for-dropout-backlog-students',
  '/b-tech-credit-transfer-alappuzha',
  '/b-tech-credit-transfer-ernakulam',
  '/b-tech-credit-transfer-idukki',
  '/b-tech-credit-transfer-in-kochi',
  '/b-tech-credit-transfer-kannur',
  '/b-tech-credit-transfer-kasaragod',
  '/b-tech-credit-transfer-kollam',
  '/b-tech-credit-transfer-kottayam',
  '/b-tech-credit-transfer-kozhikode',
  '/b-tech-credit-transfer-malappuram',
  '/b-tech-credit-transfer-palakkad',
  '/b-tech-credit-transfer-pathanamthitta',
  '/b-tech-credit-transfer-thiruvananthapuram',
  '/b-tech-credit-transfer-thrissur',
  '/b-tech-credit-transfer-wayanad',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes are plain React components with no stored "last changed"
  // date anywhere in the project, so lastModified is omitted for them
  // rather than stamped with new Date() on every build — that previously
  // made every static page falsely report as "modified today" on every
  // deploy. Blog and University entries below keep their real updatedAt.
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  let universityEntries: MetadataRoute.Sitemap = [];

  try {
    const blogs = await prisma.blog.findMany({ select: { id: true, updatedAt: true } });
    blogEntries = blogs.map((b) => ({
      url: `${SITE_URL}/blog/${b.id}`,
      lastModified: b.updatedAt,
    }));
  } catch {
    // DB unreachable at build time — ship the static routes only
  }

  try {
    const universities = await prisma.university.findMany({ select: { id: true } });
    universityEntries = universities.map((u) => ({
      url: `${SITE_URL}/universities/${u.id}`,
    }));
  } catch {
    // DB unreachable at build time — ship the static routes only
  }

  return [...staticEntries, ...blogEntries, ...universityEntries];
}
