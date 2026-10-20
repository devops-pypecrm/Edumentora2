import React from 'react';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { PrismaClient } from '@prisma/client';
import ProgramFilter from './ProgramFilter';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Programmes',
  description: 'Discover our comprehensive programs designed to help working professionals convert their valuable experience into academic credits and achieve their career goals.',
  path: '/programs',
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const revalidate = 3600;

export default async function ProgramsPage() {
  let programs: any[] = [];
  try {
    programs = await prisma.program.findMany({
      orderBy: { createdAt: 'asc' }
    });
  } catch (error) {
    console.error("Error fetching programs:", error);
  }

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />
      
      <PageBanner
        badge="Professional & Career Advancement"
        title="Empower Your Future with Flexible Learning Programs"
        subtitle="Discover our comprehensive programs designed to help working professionals convert their valuable experience into academic credits and achieve their career goals."
        isGradientText={true}
      />
      
      {/* INTERACTIVE FILTER & PROGRAMS LIST */}
      <React.Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-gray-500 font-medium">Loading programs...</div>}>
        <ProgramFilter programs={programs} />
      </React.Suspense>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
