"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PageBanner from '@/components/PageBanner';
import { Building2, Award, GraduationCap, MapPin, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';

type University = {
  id: string;
  name: string;
  location: string;
  description: string;
  mainImage?: string | null;
  logo?: string | null;
  certificates: string[];
};

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
        badge="Global Academic Partnerships"
        title="Partner Universities"
        subtitle="Explore our globally recognized partner institutions and discover the perfect program for your academic journey and credit transfer."
        isGradientText={true}
      />

      {/* Filter & Grid Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-20 bg-white">
        
        {/* Modern Filter Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 rounded-full font-medium text-[15px] tracking-wide transition-all duration-300 ${
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
          {filteredData.map((item, index) => (
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
                <h3 className="text-[28px] font-semibold text-[#002147] mb-2 leading-[1.2] tracking-tight">
                  {item.name}
                </h3>
                
                {item.location && (
                  <div className="flex items-center text-gray-500 mb-5 text-[15px]">
                    <MapPin className="w-4 h-4 mr-1.5 text-[#F9010D]" />
                    {item.location}
                  </div>
                )}

                <p className="text-[16px] text-gray-600 leading-relaxed mb-6 line-clamp-3">
                  {item.description}
                </p>

                {/* Info Row: Highlights */}
                <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-8 pt-6 border-t border-gray-100/80">
                  {item.certificates && item.certificates.length > 0 && item.certificates.map((cert, i) => (
                    <div key={i} className="flex items-start text-[14px] text-gray-600 col-span-2 md:col-span-1">
                      <Award className="w-4 h-4 mr-2 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="leading-tight">{cert}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom: Buttons */}
                <div className="mt-auto flex gap-3 pt-2">
                  <Link href={`/universities/${item.id}`} className="flex-1 bg-[#F9010D] hover:bg-[#F9010D] text-white text-[15px] font-medium py-3.5 px-4 rounded-xl flex items-center justify-center transition-colors shadow-sm">
                    View Details
                  </Link>
                  <Link href="/contact" className="flex-1 bg-white hover:bg-gray-50 text-[#002147] text-[15px] font-medium py-3.5 px-4 rounded-xl border border-gray-200 flex items-center justify-center transition-colors">
                    Enquire
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 py-32 text-xl font-medium animate-in fade-in">
            No universities found for {activeFilter}.
          </div>
        )}
      </div>

      {/* Informational Text Section */}
      <div className="bg-white border-t border-gray-100 py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 space-y-8 text-[17px] text-gray-600 leading-[1.8]">
          <h2 className="text-3xl font-bold text-[#002147] mb-8 text-center">Why Choose University Credit Transfer?</h2>
          <p>
            Many students reach a point where they want to change their university. The reason may be different for everyone – some go to another city with their family, some seek better courses or features, and others want a university that provides more career support. In such cases, starting the degree all over again would feel unfair. This is why University Credit Transfer exists.
          </p>
          <p>
            With University Credit Transfer, the subjects and credits a student has already earned will never go to waste. Instead, the new university reviews the mark sheets and syllabus from the previous institution and then accepts the subjects that match. After approval, the student can continue from the right semester rather than beginning from the first year.
          </p>
          <p>
            The university credit transfer saves both time and money. This is the main advantage of choosing this credit. Students do not need to repeat classes that they have already passed. It also provides flexibility, which gives them a chance to study in a suitable location that fits with their personal or business goals.
          </p>
          <p className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-[#002147] font-medium">
            For students who are thinking about moving, understanding University Credit Transfer can make the shift simple and smooth. It values past efforts and helps them finish their degree on time.
          </p>
        </div>
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
