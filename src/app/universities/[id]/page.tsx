import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocationsSection from '@/components/LocationsSection';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PageBanner from '@/components/PageBanner';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { MapPin, Award, ArrowLeft, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import AdditionalUniversityDetails from './ViewMoreDetails';
import UniversityProgramsSection from './UniversityProgramsSection';
import type { Metadata } from 'next';
import { pageMetadata, breadcrumbJsonLd, courseJsonLd, courseListJsonLd } from '@/lib/seo';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const revalidate = 3600;

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  if (!id) return {};

  const university = await prisma.university.findUnique({ where: { id } });
  if (!university) return {};

  const description = `${university.name}, ${university.location} — ${university.description}`;

  return pageMetadata({
    title: university.name,
    description: description.length > 160 ? `${description.slice(0, 157)}...` : description,
    path: `/universities/${id}`,
  });
}

export default async function UniversityDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id) {
    notFound();
  }

  const university = await prisma.university.findUnique({
    where: { id },
    include: {
      brochure: true,
    },
  });

  if (!university) {
    notFound();
  }

  const universityPrograms = await prisma.universityProgram.findMany({
    where: { universityId: id },
    orderBy: { createdAt: 'asc' },
  });

  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Universities', path: '/universities' },
    { name: university.name, path: `/universities/${id}` },
  ]);
  const courseLd = courseJsonLd(university, universityPrograms);
  const courseListLd = courseListJsonLd(university, universityPrograms);

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {courseListLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseListLd) }}
        />
      ) : (
        courseLd.map((course, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(course) }}
          />
        ))
      )}
      <Header />

      <PageBanner title={university.name}>
        <div className="pt-8">
          <Link 
            href="/universities" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Universities
          </Link>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#002147] leading-tight mb-4 tracking-tight font-[Poppins]">
            {university.name}
          </h1>
          
          {university.location && (
            <div className="flex items-center text-[#002147]/90 text-lg">
              <MapPin className="w-5 h-5 mr-2 text-[#F9010D]" />
              {university.location}
            </div>
          )}
        </div>
      </PageBanner>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {university.mainImage && (
            <div className="w-full h-[300px] md:h-[500px] relative bg-gray-100">
              <img 
                src={university.mainImage} 
                alt={university.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold text-[#002147] mb-6">About the University</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap mb-10">
              {university.description}
            </div>

            {university.brochure && (
              <div className="mb-10 flex items-center justify-between gap-4 p-6 bg-[#002147]/5 rounded-2xl border border-[#002147]/10">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-[#F9010D]/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#F9010D]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#002147]">University Brochure</h4>
                    <p className="text-sm text-gray-500 truncate">{university.brochure.fileName}</p>
                  </div>
                </div>
                <a
                  href={university.brochure.fileUrl}
                  download={university.brochure.fileName}
                  className="flex-shrink-0 inline-flex items-center gap-2 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold text-sm py-3 px-5 rounded-xl shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            )}

            {university.certificates && university.certificates.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-[#002147] mb-6 border-t border-gray-100 pt-8">
                  Recognitions & Certificates
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {university.certificates.map((cert, i) => (
                    <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <Award className="w-6 h-6 mr-3 text-yellow-600 flex-shrink-0" />
                      <span className="text-gray-800 font-medium">{cert}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            <UniversityProgramsSection programs={universityPrograms} />

            <AdditionalUniversityDetails university={university} />

            <div className="mt-12 flex justify-center">
              <Link href="/contact" className="bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold py-4 px-10 rounded-xl shadow-lg transition-transform hover:-translate-y-1">
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
