'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type HeroSlideStatus = 'SHOW' | 'HIDE';

async function requireAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_auth_token')?.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

function refreshCarousel() {
  revalidatePath('/admin/hero-carousel');
  revalidatePath('/');
}

const isMobileSlide = (altText: string | null | undefined): boolean =>
  Boolean(altText && altText.trim().startsWith('[MOBILE]'));

export async function createHeroSlide(formData: FormData) {
  await requireAdmin();
  const imageUrl = String(formData.get('imageUrl') || '');
  const category = String(formData.get('category') || 'desktop').toLowerCase();
  const rawAlt = String(formData.get('altText') || '').trim();

  if (!imageUrl.startsWith('data:image/')) throw new Error('A valid image is required.');

  const prefix = category === 'mobile' ? '[MOBILE] ' : '[DESKTOP] ';
  const defaultLabel = category === 'mobile' ? 'Mobile hero image' : 'Desktop hero image';
  const altText = `${prefix}${rawAlt || defaultLabel}`;

  const lastSlide = await prisma.heroSlide.findFirst({
    where: category === 'mobile'
      ? { altText: { startsWith: '[MOBILE]' } }
      : { NOT: { altText: { startsWith: '[MOBILE]' } } },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  await prisma.heroSlide.create({
    data: { imageUrl, altText, status: 'SHOW', order: (lastSlide?.order ?? -1) + 1 },
  });
  refreshCarousel();
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await requireAdmin();
  const imageUrl = String(formData.get('imageUrl') || '');
  const rawAlt = String(formData.get('altText') || '').trim();
  const category = formData.get('category') ? String(formData.get('category')).toLowerCase() : null;

  const existing = await prisma.heroSlide.findUnique({ where: { id } });
  if (!existing) throw new Error('Slide not found.');

  const currentIsMobile = isMobileSlide(existing.altText);
  const targetIsMobile = category ? category === 'mobile' : currentIsMobile;
  const prefix = targetIsMobile ? '[MOBILE] ' : '[DESKTOP] ';

  let altText: string | undefined = undefined;
  if (rawAlt) {
    altText = `${prefix}${rawAlt.replace(/^\[(MOBILE|DESKTOP)\]\s*/i, '')}`;
  } else if (category && targetIsMobile !== currentIsMobile) {
    const cleanExisting = existing.altText.replace(/^\[(MOBILE|DESKTOP)\]\s*/i, '');
    altText = `${prefix}${cleanExisting}`;
  }

  await prisma.heroSlide.update({
    where: { id },
    data: {
      ...(altText ? { altText } : {}),
      ...(imageUrl.startsWith('data:image/') ? { imageUrl } : {}),
    },
  });
  refreshCarousel();
}

export async function setHeroSlideStatus(id: string, status: HeroSlideStatus) {
  await requireAdmin();
  await prisma.heroSlide.update({ where: { id }, data: { status } });
  refreshCarousel();
}

export async function setHeroContentVisibility(showContent: boolean) {
  await requireAdmin();
  await prisma.heroConfig.upsert({
    where: { id: 'homepage-hero' },
    update: { showContent },
    create: { id: 'homepage-hero', showContent },
  });
  refreshCarousel();
}

export async function moveHeroSlide(id: string, direction: 'up' | 'down') {
  await requireAdmin();
  const current = await prisma.heroSlide.findUnique({ where: { id } });
  if (!current) return;

  const currentIsMobile = isMobileSlide(current.altText);
  const allSlides = await prisma.heroSlide.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  });

  const categorySlides = allSlides.filter((slide) => isMobileSlide(slide.altText) === currentIsMobile);
  const index = categorySlides.findIndex((slide) => slide.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= categorySlides.length) return;

  const other = categorySlides[swapIndex];
  await prisma.heroSlide.update({ where: { id: current.id }, data: { order: other.order } });
  await prisma.heroSlide.update({ where: { id: other.id }, data: { order: current.order } });
  refreshCarousel();
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  refreshCarousel();
}
