"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PageBanner from '@/components/PageBanner';
import BrochureDownload from '@/components/BrochureDownload';
import {
  Building2, 
  Award, 
  GraduationCap, 
  MapPin, 
  ShieldCheck, 
  Layers 
} from 'lucide-react';
import { 
  PartnershipFrameworkBanner, 
  UniversityApprovalProcess, 
  UniversityEligibilityChecklist 
} from '@/components/UniversityTrustFramework';

type UniversityProgramSummary = {
  id: string;
  programName: string | null;
  courseDuration: string | null;
  specializations: string[];
};

type University = {
  id: string;
  name: string;
  location: string;
  description: string;
  mainImage?: string | null;
  logo?: string | null;
  certificates: string[];
  programs?: UniversityProgramSummary[];
};

function getUniversityProgramTags(item: University): string[] {
  if (item.programs && item.programs.length > 0) {
    const names = item.programs
      .map(p => p.programName)
      .filter((n): n is string => !!n && n.trim().length > 0);
    if (names.length > 0) {
      return names.slice(0, 3);
    }
  }
  const desc = (item.description || '').toLowerCase();
  const tags: string[] = [];
  if (desc.includes('b.tech') || desc.includes('engineering') || desc.includes('technology')) {
    tags.push('B.Tech Lateral Entry');
  }
  if (desc.includes('diploma') || desc.includes('polytechnic')) {
    tags.push('Polytechnic Diploma');
  }
  if (desc.includes('management') || desc.includes('bba') || desc.includes('mba')) {
    tags.push('Management (BBA/MBA)');
  }
  if (desc.includes('computer') || desc.includes('bca') || desc.includes('mca')) {
    tags.push('Computer Applications (BCA/MCA)');
  }
  if (tags.length === 0) {
    tags.push('B.Tech Lateral Entry', 'Diploma Transfer', 'UG Degrees');
  }
  return tags.slice(0, 3);
}

export default function UniversitiesClient({ universities }: { universities: University[] }) {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  // Extract unique university names for filters
  const filters = ['All', ...Array.from(new Set(universities.map(u => u.name)))];
  
  const initialFilter = filterParam && filters.includes(filterParam) ? filterParam : 'All';
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    if (filterParam && filters.includes(filterParam)) {
      setActiveFilter(filterParam);
    } else {
      setActiveFilter('All');
    }
  }, [filterParam]);

  const filteredData = activeFilter === 'All' 
    ? universities 
    : universities.filter(item => item.name === activeFilter);

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />
      
      <PageBanner
        badge="Accredited Academic Partnerships"
        title="Partner Universities"
        subtitle="Explore our verified partner universities offering statutory credit transfer, lateral entry programs, and UGC-recognized degree completion."
        isGradientText={true}
      />

      {/* Filter & Grid Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16 bg-white">
        
        {/* Partnership Framework & Governance Banner */}
        <PartnershipFrameworkBanner />

        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-[#F9010D] font-bold text-xs uppercase tracking-widest block mb-2">
            Institutional Network
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#002147] tracking-tight">
            Explore Approved Universities & Programs
          </h2>
          <p className="text-gray-600 text-sm md:text-base mt-2">
            Select an institution below to view academic accreditations, eligible credit transfer branches, and admission procedures.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2.5 rounded-full font-medium text-sm tracking-wide transition-all duration-300 ${
                activeFilter === filter
                  ? 'bg-[#F9010D] text-white shadow-[0_8px_20px_-6px_rgba(249,1,13,0.5)] transform -translate-y-0.5'
                  : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-[#002147] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
          {filteredData.map((item, index) => {
            const programTags = getUniversityProgramTags(item);

            return (
              <div 
                key={item.id} 
                className="group bg-white rounded-[28px] overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.04)] border border-gray-100/80 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(23,42,83,0.15)] hover:-translate-y-2 flex flex-col"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Top: Image Wrapper */}
                <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                  {item.mainImage ? (
                    <img 
                      src={item.mainImage} 
                      alt={item.name} 
                      className="object-cover w-full h-full transform transition-transform duration-700 group-hover:scale-105" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#002147] to-[#254175] flex items-center justify-center">
                      <Building2 className="w-16 h-16 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                  {item.logo && (
                    <div className="absolute top-4 right-4 z-10 w-14 h-14 rounded-xl bg-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] p-1.5 flex items-center justify-center overflow-hidden">
                      <img src={item.logo} alt={`${item.name} logo`} className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Middle: Content */}
                <div className="p-8 flex-grow flex flex-col">
                  {/* Authorized Partnership Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#002147] text-xs font-semibold w-fit mb-3 border border-blue-100/60">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F9010D]" />
                    <span>Authorized Guidance Partner</span>
                  </div>

                  <h3 className="text-[24px] font-semibold text-[#002147] mb-2 leading-[1.25] tracking-tight">
                    {item.name}
                  </h3>
                  
                  {item.location && (
                    <div className="flex items-center text-gray-500 mb-4 text-[14px]">
                      <MapPin className="w-4 h-4 mr-1.5 text-[#F9010D]" />
                      {item.location}
                    </div>
                  )}

                  <p className="text-[15px] text-gray-600 leading-relaxed mb-5 line-clamp-3">
                    {item.description}
                  </p>

                  {/* Applicable Programs Section */}
                  <div className="mb-5 pt-4 border-t border-gray-100">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#002147]/80 mb-2.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#F9010D]" />
                      <span>Applicable Transfer Programs</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {programTags.map((tag, i) => (
                        <span 
                          key={i} 
                          className="px-2.5 py-1 bg-gray-50 border border-gray-200/80 rounded-lg text-xs font-medium text-[#002147]"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.programs && item.programs.length > 3 && (
                        <span className="px-2 py-1 bg-red-50 text-[#F9010D] rounded-lg text-xs font-bold">
                          +{item.programs.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Accreditations & Recognitions */}
                  {item.certificates && item.certificates.length > 0 && (
                    <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 mb-6 pt-4 border-t border-gray-100">
                      {item.certificates.slice(0, 4).map((cert, i) => (
                        <div key={i} className="flex items-start text-xs text-gray-600 col-span-2 sm:col-span-1">
                          <Award className="w-3.5 h-3.5 mr-1.5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="leading-tight font-medium truncate">{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom: Buttons */}
                  <div className="mt-auto flex gap-3 pt-2">
                    <Link href={`/universities/${item.id}`} className="flex-1 bg-[#F9010D] hover:bg-[#F9010D]/90 text-white text-[14px] font-semibold py-3 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                      View Details & Programs
                    </Link>
                    <BrochureDownload
                      source={`Brochure Download - ${item.name.trim()}`}
                      fileUrl={`/api/brochures/${item.id}`}
                      fileName={`${item.name.trim()} Brochure.pdf`}
                      buttonClassName="flex-1 bg-white hover:bg-gray-50 text-[#002147] text-[14px] font-semibold py-3 px-4 rounded-xl border border-gray-200 flex items-center justify-center transition-colors"
                    >
                      Download Brochure
                    </BrochureDownload>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 py-32 text-xl font-medium animate-in fade-in">
            No universities found for {activeFilter}.
          </div>
        )}

        {/* 4-Stage Approval Process */}
        <UniversityApprovalProcess />

        {/* Eligibility & Document Verification Checklist */}
        <UniversityEligibilityChecklist />

      </div>

      {/* Educational Information Section */}
      <div className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-6 text-[16px] text-gray-600 leading-[1.8]">
          <h2 className="text-3xl font-bold text-[#002147] mb-6 text-center">
            How University Credit Transfer Safeguards Your Degree
          </h2>
          <p>
            When unexpected obstacles force you to pause your degree—whether due to relocation, financial challenges, or backlogs—academic credit transfer offers a formal, statutory method to continue higher education without discarding your past work. Under UGC and statutory guidelines, accredited universities can evaluate previously completed course outcomes and recognize equivalent subjects.
          </p>
          <p>
            The receiving university’s Board of Studies compares your prior syllabus with their current curriculum. Equivalent subjects are granted credit exemptions, placing you directly into the qualifying semester. This eliminates unnecessary repetition, minimizes tuition costs, and shortens your remaining timeline to graduation.
          </p>
          <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-100/80 text-[#002147] font-medium text-sm md:text-base flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-[#F9010D] shrink-0 mt-0.5" />
            <div>
              <strong>Academic Integrity Guarantee:</strong> All partner universities listed in Edumentora’s network are established under Central/State Acts and recognized by the University Grants Commission (UGC). Degrees awarded upon program completion hold full statutory validity for competitive examinations (UPSC, GATE, PSC), PSU employment, and overseas higher education credentials evaluation (WES).
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
