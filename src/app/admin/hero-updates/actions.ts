'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export type HeroSectionContentData = {
  mainHeading: string;
  mainHeadingColor: string;
  rotatingWords: string;
  rotatingWordsColor: string;
  subHeading: string;
  subHeadingColor: string;
  paragraph: string;
  paragraphColor: string;
  showEligibilityForm: boolean;
  showHeroButtons: boolean;
  hideMobileContent: boolean;
};

const DEFAULT_HERO_CONTENT: HeroSectionContentData = {
  mainHeading: 'Without Starting\nOver, Continue\nYour ',
  mainHeadingColor: '#002147',
  rotatingWords: 'B.Tech, UG, PG, Diploma',
  rotatingWordsColor: '#F9010D',
  subHeading: 'Academic Credit Transfer Guidance in Kerala',
  subHeadingColor: '#002147',
  paragraph:
    'Transfer your eligible credits to UGC-approved, AICTE-recognized universities and resume your studies from an advanced semester — saving valuable time and effort.',
  paragraphColor: '#4b5563',
  showEligibilityForm: true,
  showHeroButtons: true,
  hideMobileContent: false,
};

async function requireAdmin() {
  const cookieStore = await cookies();
  if (cookieStore.get('admin_auth_token')?.value !== 'authenticated') {
    throw new Error('Unauthorized');
  }
}

function refreshHero() {
  revalidatePath('/admin/hero-updates');
  revalidatePath('/');
}

export async function getHeroSectionContent(): Promise<HeroSectionContentData> {
  try {
    const db = prisma as any;
    const res: any = await db.$runCommandRaw({
      find: 'hero_section_content',
      filter: { _id: 'homepage-hero-content' },
    });
    const doc = res?.cursor?.firstBatch?.[0];
    if (doc) {
      return {
        mainHeading: typeof doc.mainHeading === 'string' && doc.mainHeading ? doc.mainHeading : DEFAULT_HERO_CONTENT.mainHeading,
        mainHeadingColor: doc.mainHeadingColor || DEFAULT_HERO_CONTENT.mainHeadingColor,
        rotatingWords: doc.rotatingWords || DEFAULT_HERO_CONTENT.rotatingWords,
        rotatingWordsColor: doc.rotatingWordsColor || DEFAULT_HERO_CONTENT.rotatingWordsColor,
        subHeading: doc.subHeading || DEFAULT_HERO_CONTENT.subHeading,
        subHeadingColor: doc.subHeadingColor || DEFAULT_HERO_CONTENT.subHeadingColor,
        paragraph: doc.paragraph || DEFAULT_HERO_CONTENT.paragraph,
        paragraphColor: doc.paragraphColor || DEFAULT_HERO_CONTENT.paragraphColor,
        showEligibilityForm: doc.showEligibilityForm !== false,
        showHeroButtons: doc.showHeroButtons !== false,
        hideMobileContent: doc.hideMobileContent === true,
      };
    }
  } catch (error) {
    console.error('Failed to fetch hero content:', error);
  }
  return DEFAULT_HERO_CONTENT;
}

export async function updateHeroSectionContent(formData: FormData) {
  await requireAdmin();
  const mainHeading = String(formData.get('mainHeading') || DEFAULT_HERO_CONTENT.mainHeading).trim();
  const mainHeadingColor = String(formData.get('mainHeadingColor') || '#002147').trim();
  const rotatingWords = String(formData.get('rotatingWords') || DEFAULT_HERO_CONTENT.rotatingWords).trim();
  const rotatingWordsColor = String(formData.get('rotatingWordsColor') || '#F9010D').trim();
  const subHeading = String(formData.get('subHeading') || '').trim();
  const subHeadingColor = String(formData.get('subHeadingColor') || '#002147').trim();
  const paragraph = String(formData.get('paragraph') || '').trim();
  const paragraphColor = String(formData.get('paragraphColor') || '#4b5563').trim();
  const showEligibilityForm = formData.get('showEligibilityForm') === 'true';
  const showHeroButtons = formData.get('showHeroButtons') === 'true';
  const hideMobileContent = formData.get('hideMobileContent') === 'true';

  const db = prisma as any;
  await db.$runCommandRaw({
    update: 'hero_section_content',
    updates: [
      {
        q: { _id: 'homepage-hero-content' },
        u: {
          $set: {
            mainHeading,
            mainHeadingColor,
            rotatingWords,
            rotatingWordsColor,
            subHeading,
            subHeadingColor,
            paragraph,
            paragraphColor,
            showEligibilityForm,
            showHeroButtons,
            hideMobileContent,
            updatedAt: { $date: new Date().toISOString() },
          },
        },
        upsert: true,
      },
    ],
  });

  refreshHero();
  return { success: true };
}

export async function toggleMobileContentVisibility(hideMobileContent: boolean) {
  await requireAdmin();
  const db = prisma as any;
  await db.$runCommandRaw({
    update: 'hero_section_content',
    updates: [
      {
        q: { _id: 'homepage-hero-content' },
        u: {
          $set: {
            hideMobileContent,
            updatedAt: { $date: new Date().toISOString() },
          },
        },
        upsert: true,
      },
    ],
  });

  refreshHero();
  return { success: true };
}

export async function toggleHeroButtonsVisibility(showHeroButtons: boolean) {
  await requireAdmin();
  const db = prisma as any;
  await db.$runCommandRaw({
    update: 'hero_section_content',
    updates: [
      {
        q: { _id: 'homepage-hero-content' },
        u: {
          $set: {
            showHeroButtons,
            updatedAt: { $date: new Date().toISOString() },
          },
        },
        upsert: true,
      },
    ],
  });

  refreshHero();
  return { success: true };
}

export async function toggleEligibilityFormVisibility(showEligibilityForm: boolean) {
  await requireAdmin();
  const db = prisma as any;
  await db.$runCommandRaw({
    update: 'hero_section_content',
    updates: [
      {
        q: { _id: 'homepage-hero-content' },
        u: {
          $set: {
            showEligibilityForm,
            updatedAt: { $date: new Date().toISOString() },
          },
        },
        upsert: true,
      },
    ],
  });

  refreshHero();
  return { success: true };
}
