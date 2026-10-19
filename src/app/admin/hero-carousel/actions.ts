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

export async function createHeroSlide(formData: FormData) {
  await requireAdmin();
  const imageUrl = String(formData.get('imageUrl') || '');
  const altText = String(formData.get('altText') || '').trim() || 'Homepage hero image';
  if (!imageUrl.startsWith('data:image/')) throw new Error('A valid image is required.');

  const lastSlide = await prisma.heroSlide.findFirst({ orderBy: { order: 'desc' }, select: { order: true } });
  await prisma.heroSlide.create({
    data: { imageUrl, altText, status: 'SHOW', order: (lastSlide?.order ?? -1) + 1 },
  });
  refreshCarousel();
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await requireAdmin();
  const imageUrl = String(formData.get('imageUrl') || '');
  const altText = String(formData.get('altText') || '').trim();

  await prisma.heroSlide.update({
    where: { id },
    data: { ...(altText ? { altText } : {}), ...(imageUrl.startsWith('data:image/') ? { imageUrl } : {}) },
  });
  refreshCarousel();
}

export async function setHeroSlideStatus(id: string, status: HeroSlideStatus) {
  await requireAdmin();
  await prisma.heroSlide.update({ where: { id }, data: { status } });
  refreshCarousel();
}

export async function moveHeroSlide(id: string, direction: 'up' | 'down') {
  await requireAdmin();
  const slides = await prisma.heroSlide.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
  const index = slides.findIndex((slide) => slide.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || swapIndex < 0 || swapIndex >= slides.length) return;

  const current = slides[index];
  const other = slides[swapIndex];
  await prisma.heroSlide.update({ where: { id: current.id }, data: { order: other.order } });
  await prisma.heroSlide.update({ where: { id: other.id }, data: { order: current.order } });
  refreshCarousel();
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin();
  await prisma.heroSlide.delete({ where: { id } });
  refreshCarousel();
}
