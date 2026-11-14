'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { blogPath } from '@/lib/slugs';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function postComment(formData: FormData): Promise<void> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const website = formData.get('website') as string | null;
  const content = formData.get('content') as string;
  const blogId = formData.get('blogId') as string;

  if (!name || !email || !content || !blogId) {
    throw new Error('Required fields missing');
  }

  try {
    await prisma.comment.create({
      data: {
        name,
        email,
        website: website || null,
        content,
        blogId,
      },
    });

    revalidatePath(`/blog/${blogId}`);
    revalidatePath(blogPath(blogId));
  } catch (error) {
    console.error('Error posting comment:', error);
    throw new Error('Failed to post comment');
  }
}
