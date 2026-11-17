import React from 'react';
import { PrismaClient } from '@prisma/client';
import FaqManager from '@/components/admin/FaqManager';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const dynamic = 'force-dynamic';

export default async function HomeFaqPage() {
  const faqs = await prisma.faq.findMany({
    where: { type: 'HOME' },
    orderBy: { createdAt: 'asc' },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Home FAQ</h1>
        <p className="text-gray-600">Manage the FAQs shown in the &ldquo;Frequently Asked Questions&rdquo; section on the home page, below &ldquo;Ready To Grow with Edumentora&rdquo;.</p>
      </div>

      <FaqManager
        type="HOME"
        initialFaqs={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
      />
    </div>
  );
}
