'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type FaqType = 'ABOUT' | 'BTECH' | 'HOME';

function revalidateFor(type: FaqType) {
  if (type === 'HOME') {
    revalidatePath('/admin/faq/home');
    revalidatePath('/');
    return;
  }
  revalidatePath(type === 'ABOUT' ? '/admin/faq/about' : '/admin/faq/btech');
  revalidatePath(type === 'ABOUT' ? '/about-us' : '/b-tech-credit-transfer');
}

export async function createFaq(type: FaqType, formData: FormData) {
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;

  if (!question || !answer) return;

  await prisma.faq.create({
    data: { type, question, answer },
  });

  revalidateFor(type);
}

export async function updateFaq(id: string, type: FaqType, formData: FormData) {
  const question = formData.get('question') as string;
  const answer = formData.get('answer') as string;

  if (!question || !answer) return;

  await prisma.faq.update({
    where: { id },
    data: { question, answer },
  });

  revalidateFor(type);
}

export async function deleteFaq(id: string, type: FaqType) {
  await prisma.faq.delete({
    where: { id },
  });

  revalidateFor(type);
}

// Used by the public-facing pages (client components) to fetch FAQs live.
export async function getPublicFaqs(type: FaqType) {
  const faqs = await prisma.faq.findMany({
    where: { type },
    orderBy: { createdAt: 'asc' },
  });
  return faqs.map((f) => ({ id: f.id, q: f.question, a: f.answer }));
}
