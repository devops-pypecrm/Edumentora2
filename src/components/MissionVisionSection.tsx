'use client';

import React from 'react';
import { Target, Eye } from 'lucide-react';

export default function MissionVisionSection() {
  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 md:px-12 lg:px-16 pb-4 pt-4 lg:pb-8 lg:pt-8 relative bg-white dot-grid rounded-[2.5rem] overflow-hidden">
      <div className="relative w-full mx-auto">
        <div
          className="relative rounded-[2rem] overflow-hidden shadow-2xl w-full p-[12px]"
          style={{
            backgroundImage: 'repeating-linear-gradient(100deg, #5C3A21 0px, #8B5E34 5px, #6B4423 10px, #7A5233 15px, #5C3A21 20px)',
          }}
        >
        <div className="relative bg-[#D9BD94] rounded-[1.5rem] p-4 md:p-8 lg:p-10 overflow-hidden w-full h-full">

        {/* Background textures - grid lines (desktop/tablet only; kept off mobile for a simpler look) */}
        <div
          aria-hidden
          className="hidden md:block pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply"
          style={{
            backgroundImage:
              "repeating-linear-gradient(12deg, transparent 0px, transparent 38px, rgba(0,0,0,0.35) 39px, transparent 41px, transparent 90px), repeating-linear-gradient(102deg, transparent 0px, transparent 55px, rgba(0,0,0,0.3) 56px, transparent 58px, transparent 130px), repeating-linear-gradient(165deg, transparent 0px, transparent 47px, rgba(0,0,0,0.28) 48px, transparent 50px, transparent 110px)",
          }}
        />
        {/* crackled paper texture - fine grain (desktop/tablet only) */}
        <div
          aria-hidden
          className="hidden md:block pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' seed='7'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.3 0 0 0 0 0.25 0 0 0 0 0.15 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: '300px 300px',
          }}
        />
        {/* subtle vignette to deepen edges like an aged sheet (desktop/tablet only) */}
        <div
          aria-hidden
          className="hidden md:block pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(120% 100% at 50% 50%, transparent 65%, rgba(0,0,0,0.05) 100%)',
          }}
        />

        <div className="relative z-10 space-y-4 w-full">
          {/* Heading — smaller on mobile, same text and same size from md: up */}
          <h2 className="text-[26px] md:text-[44px] lg:text-[50px] font-[Poppins] font-extrabold text-[#5C3A21] leading-[1.15] md:leading-[1.1] tracking-tight mb-2 md:mb-4">
            Empowering Students<br className="hidden md:block"/>
            <span className="text-[#8B5E34]">Through Credit Transfer</span>
          </h2>

          {/* Desktop/tablet: original paragraph + Mission/Vision blocks, unchanged */}
          <p className="hidden md:block text-[18px] text-[#3B2412]/90 leading-[1.8] w-full">
            Resume your graduation or postgraduate education through Edumentora, a leading academic credit transfer institution. Transfer earned credits for B. Tech, engineering, and other programs to recognized universities, saving time and costs while achieving academic success.
          </p>

          <div className="hidden md:block space-y-2 pt-2">
            <h3 className="text-[24px] font-semibold text-[#5C3A21]">Our Mission</h3>
            <p className="text-[15px] md:text-[16px] text-[#3B2412]/90 leading-[1.6] w-full text-justify">
              At Edumentora, our mission is to empower students to overcome academic setbacks by providing a seamless and fully supported pathway for credit transfers. We ensure that every previously earned credit is respected, helping learners transition to UGC-accredited universities. Through personalized guidance, we strive to save students valuable time and financial resources, turning educational interruptions into renewed opportunities for lifelong success.
            </p>
          </div>

          <div className="hidden md:block space-y-2 pt-2">
            <h3 className="text-[24px] font-semibold text-[#5C3A21]">Our Vision</h3>
            <p className="text-[15px] md:text-[16px] text-[#3B2412]/90 leading-[1.6] w-full text-justify">
              Our vision at Edumentora is to create an inclusive educational landscape where no student is left behind due to past hurdles. We envision a future where every individual has unrestricted access to complete their higher education without having to start from scratch. By breaking down academic barriers and championing flexible learning pathways, we aim to be India&apos;s most trusted partner in transforming past progress into lasting achievement.
            </p>
          </div>

          {/* Mobile-only: shorter intro + Mission/Vision as simple bordered icon boxes */}
          <div className="md:hidden space-y-3">
            <p className="text-[14px] text-[#3B2412]/90 leading-[1.6] w-full">
              Resume your education through Edumentora — transfer your earned credits to recognized universities and save time and money.
            </p>

            <div className="border border-[#5C3A21]/30 rounded-xl px-3.5 py-3 bg-[#D9BD94]/40">
              <div className="flex items-center gap-2 mb-1.5">
                <Target className="w-4 h-4 text-[#5C3A21] shrink-0" />
                <h3 className="text-[16px] font-semibold text-[#5C3A21]">Our Mission</h3>
              </div>
              <p className="text-[13px] text-[#3B2412]/90 leading-[1.5]">
                We help students overcome academic setbacks with a seamless, fully supported credit transfer process — respecting every credit earned and guiding you to UGC-accredited universities.
              </p>
            </div>

            <div className="border border-[#5C3A21]/30 rounded-xl px-3.5 py-3 bg-[#D9BD94]/40">
              <div className="flex items-center gap-2 mb-1.5">
                <Eye className="w-4 h-4 text-[#5C3A21] shrink-0" />
                <h3 className="text-[16px] font-semibold text-[#5C3A21]">Our Vision</h3>
              </div>
              <p className="text-[13px] text-[#3B2412]/90 leading-[1.5]">
                An inclusive education system where no student is held back by past setbacks — with flexible pathways to complete your degree without starting over.
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      </div>
    </section>
  );
}
