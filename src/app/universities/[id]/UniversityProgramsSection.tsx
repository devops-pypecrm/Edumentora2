'use client';

import React, { useState } from 'react';
import { CheckCircle2, Briefcase, Wallet, Clock, ArrowRight, X, Layers } from 'lucide-react';

type UniversityProgram = {
  id: string;
  programName: string | null;
  courseDescription: string | null;
  specializations: string[];
  courseDuration: string | null;
  eligibilityCriteria: string[];
  careerOpportunities: string[];
  feeStructure: string | null;
};

function ProgramRow({ program, onViewMore }: { program: UniversityProgram; onViewMore: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-6 py-5">
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="font-bold text-[#002147] truncate">{program.programName || 'Untitled Program'}</span>
        {program.courseDuration && (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#002147] bg-[#F9010D]/20 px-3 py-1 rounded-full w-fit flex-shrink-0">
            <Clock className="w-3.5 h-3.5" />
            {program.courseDuration}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onViewMore}
        className="self-start sm:self-center flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-[#002147] hover:bg-[#002147]/90 rounded-full transition-colors"
      >
        View More
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function ProgramModal({ program, onClose }: { program: UniversityProgram; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#002147] rounded-t-3xl sticky top-0">
          <div className="min-w-0">
            <div className="text-white font-bold text-lg truncate">{program.programName || 'Untitled Program'}</div>
            {program.courseDuration && (
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#F9010D] mt-1">
                <Clock className="w-3.5 h-3.5" />
                {program.courseDuration}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white bg-white/10 p-2 rounded-full flex-shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {program.courseDescription && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {program.courseDescription}
            </p>
          )}

          {program.specializations.length > 0 && (
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#002147] uppercase tracking-wide mb-3">
                <Layers className="w-4 h-4 text-[#F9010D]" />
                Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {program.specializations.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-[#002147]/5 text-[#002147] text-sm font-medium rounded-full">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {program.eligibilityCriteria.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#002147] uppercase tracking-wide mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#F9010D]" />
                  Eligibility Criteria
                </h4>
                <ul className="space-y-2">
                  {program.eligibilityCriteria.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-[#F9010D] mr-2 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {program.careerOpportunities.length > 0 && (
              <div>
                <h4 className="flex items-center gap-2 text-sm font-bold text-[#002147] uppercase tracking-wide mb-3">
                  <Briefcase className="w-4 h-4 text-[#F9010D]" />
                  Career Opportunities
                </h4>
                <ul className="space-y-2">
                  {program.careerOpportunities.map((item, i) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-[#F9010D] mr-2 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {program.feeStructure && (
            <div className="flex items-center gap-2 text-sm font-semibold text-[#002147] pt-4 border-t border-gray-100">
              <Wallet className="w-4 h-4 text-[#F9010D]" />
              Fee Structure: <span className="font-normal text-gray-700">{program.feeStructure}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UniversityProgramsSection({ programs }: { programs: UniversityProgram[] }) {
  const [activeProgram, setActiveProgram] = useState<UniversityProgram | null>(null);

  if (programs.length === 0) return null;

  return (
    <>
      <h3 className="text-xl font-bold text-[#002147] mb-6 border-t border-gray-100 pt-8">
        Our University Programs
      </h3>
      <div className="bg-gray-50 rounded-2xl border border-gray-100 divide-y divide-gray-200 mb-10 overflow-hidden">
        {programs.map((program) => (
          <ProgramRow key={program.id} program={program} onViewMore={() => setActiveProgram(program)} />
        ))}
      </div>

      {activeProgram && (
        <ProgramModal program={activeProgram} onClose={() => setActiveProgram(null)} />
      )}
    </>
  );
}
