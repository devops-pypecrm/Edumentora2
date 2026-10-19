import { PrismaClient } from '@prisma/client';
import HeroCarouselManager from '@/components/admin/HeroCarouselManager';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function HeroCarouselAdminPage() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    select: { id: true, imageUrl: true, altText: true, status: true, order: true },
  });

  return (
    <div className="p-8 font-[Poppins] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Hero Carousel</h1>
      </div>
      <HeroCarouselManager initialSlides={slides} />
    </div>
  );
}
