import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import ContactSection from '@/components/ContactSection';
import MissionVisionSection from '@/components/MissionVisionSection';
import AchievementsSection from '@/components/AchievementsSection';
import ProcessSection from '@/components/ProcessSection';
import ProgramsSection from '@/components/ProgramsSection';
import AboutInstituteSection from '@/components/AboutInstituteSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import SeoContentSection from '@/components/SeoContentSection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { PrismaClient } from '@prisma/client';
import { aggregateRatingJsonLd, pageMetadata } from '@/lib/seo';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const revalidate = 3600;

export const metadata = {
  ...pageMetadata({
    title: 'Credit Transfer Institute in Kerala',
    description: 'Academic credit transfer guidance in Kerala — resume your B.Tech, UG, PG, or Diploma at a UGC-recognized university without starting over.',
    path: '/',
  }),
  // The root layout's title template doesn't apply to the index route the
  // same way it does for every other page (verified directly in the built
  // HTML) — set the final title explicitly here rather than touch the
  // shared template in layout.tsx.
  title: { absolute: 'Credit Transfer Institute in Kerala | Edumentora' },
};

export default async function Home() {
  let heroSlides: { id: string; imageUrl: string; altText: string }[] = [];
  let showHeroContent = true;
  try {
    const [slides, heroConfig] = await Promise.all([
      prisma.heroSlide.findMany({
        where: { status: 'SHOW' },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        select: { id: true, imageUrl: true, altText: true },
      }),
      prisma.heroConfig.findUnique({ where: { id: 'homepage-hero' } }),
    ]);
    heroSlides = slides;
    showHeroContent = heroConfig?.showContent ?? true;
  } catch (error) {
    console.error('Failed to fetch hero slides:', error);
  }

  let reviews: any[] = [];
  try {
    const db = prisma as any;
    const rawData = await db.$runCommandRaw({
      find: "reviews",
      sort: { postedDate: -1 }
    });
    
    if (rawData?.cursor?.firstBatch) {
      reviews = rawData.cursor.firstBatch.map((r: any) => ({
        id: r._id.$oid,
        username: r.username,
        postedDate: r.postedDate.$date,
        rating: r.rating,
        comment: r.comment,
        image: r.image || null,
        createdAt: r.createdAt.$date,
        updatedAt: r.updatedAt.$date
      }));
    }
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }

  let galleryImages: string[] = [];
  try {
    const galleries = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    galleryImages = galleries.flatMap(g => g.images).slice(0, 8);
  } catch (error) {
    console.error("Failed to fetch galleries:", error);
  }

  let promoVideos: string[] = [];
  let successVideos: string[] = [];
  try {
    const reels = await prisma.reel.findMany({ orderBy: { createdAt: 'asc' } });
    promoVideos = reels.filter(r => r.category === 'PROMO').map(r => r.videoUrl);
    successVideos = reels.filter(r => r.category === 'SUCCESS').map(r => r.videoUrl);
  } catch (error) {
    console.error("Failed to fetch reels:", error);
  }

  let statUniversities: { id: string; name: string; logo: string }[] = [];
  try {
    const unis = await prisma.university.findMany({
      where: { logo: { not: null } },
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, logo: true },
    });
    statUniversities = unis.filter(u => !!u.logo) as { id: string; name: string; logo: string }[];
  } catch (error) {
    console.error("Failed to fetch universities:", error);
  }

  let notifications: string[] = [];
  try {
    const activeNotifications = await prisma.notification.findMany({
      where: { status: 'SHOW' },
      orderBy: { createdAt: 'asc' },
    });
    notifications = activeNotifications.map(n => n.text);
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }

  const ratingJsonLd = aggregateRatingJsonLd(reviews);

  return (
    <main className="home-section-alternation min-h-screen bg-white font-[Poppins]">
      {ratingJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingJsonLd) }}
        />
      )}
      <Header />
      <Hero notifications={notifications} slides={heroSlides} showContent={showHeroContent} />
      <TestimonialSection reviews={reviews} galleryImages={galleryImages} promoVideos={promoVideos} successVideos={successVideos} />
      <MissionVisionSection />
      <AchievementsSection />
      <ProgramsSection />
      <StatsSection universities={statUniversities} />
      <ProcessSection />
      <AboutInstituteSection />
      <WhyChooseUsSection />
      <ContactSection />
      <SeoContentSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
