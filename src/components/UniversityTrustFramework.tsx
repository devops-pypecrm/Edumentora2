'use client';

import React from 'react';
import { 
  ShieldCheck, 
  FileCheck2, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  FileText, 
  HelpCircle,
  Building2,
  Scale
} from 'lucide-react';

export function PartnershipFrameworkBanner() {
  return (
    <div className="w-full bg-[#002147]/[0.02] border border-gray-100 rounded-3xl p-8 md:p-12 mb-16 relative overflow-hidden">
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F9010D]/10 border border-[#F9010D]/20 text-[#F9010D] font-bold text-xs uppercase tracking-wider mb-5">
          <ShieldCheck className="w-4 h-4 text-[#F9010D]" />
          Academic Governance & Partnership Framework
        </div>

        <h3 className="text-2xl md:text-3xl font-bold text-[#002147] mb-4 tracking-tight">
          How Our University Partnerships Work
        </h3>
        
        <p className="text-gray-600 text-base md:text-lg max-w-3xl leading-relaxed mb-8">
          We believe in 100% transparency. Edumentora works as an authorized counseling and academic facilitation partner, bridging discontinued students with UGC-recognized universities under statutory lateral entry guidelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 font-bold text-[#002147] text-base">
              <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">1</span>
              Our Role (Edumentora)
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Authorized guidance center. We audit your transcripts, map syllabus equivalence, prepare your academic dossier, and coordinate direct submission to the university.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 font-bold text-[#002147] text-base">
              <span className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center text-sm font-bold">2</span>
              University Authority
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Statutory degree-awarding bodies. University Academic Councils autonomously evaluate credits, determine semester placement, conduct examinations, and issue degrees.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5 font-bold text-[#002147] text-base">
              <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center text-sm font-bold">3</span>
              Degree Recognition
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              All degrees are awarded directly by UGC-recognized and AICTE-approved universities, valid for higher education, competitive exams (GATE/UPSC), and global employment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UniversityApprovalProcess() {
  const steps = [
    {
      num: "01",
      title: "Transcript & Syllabus Audit",
      desc: "Student submits mark sheets and course outlines from their previous institution. Our academic team performs preliminary syllabus mapping against prospective university curricula.",
      icon: <FileText className="w-6 h-6 text-[#F9010D]" />
    },
    {
      num: "02",
      title: "University Equivalence Review",
      desc: "The receiving university’s Board of Studies / Academic Council formally assesses course learning outcomes, verified credit weights, and lateral entry eligibility.",
      icon: <Scale className="w-6 h-6 text-[#002147]" />
    },
    {
      num: "03",
      title: "Official Credit Transfer Letter",
      desc: "The university issues a certified Eligibility & Exemption Letter stating the approved credits, admitted semester, and any bridge courses required.",
      icon: <FileCheck2 className="w-6 h-6 text-[#F9010D]" />
    },
    {
      num: "04",
      title: "Enrollment & Lateral Admission",
      desc: "Final enrollment is completed with the university. The student receives their official University Registration/PRN and resumes their degree without starting from year one.",
      icon: <GraduationCap className="w-6 h-6 text-[#002147]" />
    }
  ];

  return (
    <div className="w-full bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm my-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-[#F9010D] font-bold text-xs uppercase tracking-widest block mb-2">
          Academic Governance
        </span>
        <h3 className="text-2xl md:text-4xl font-extrabold text-[#002147] tracking-tight">
          4-Stage University Credit Transfer Approval Process
        </h3>
        <p className="text-gray-600 text-sm md:text-base mt-3">
          How your past credits are formally evaluated, verified, and approved by the receiving university’s academic council.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className="bg-gray-50/70 hover:bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg flex flex-col relative group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <span className="text-2xl font-black text-gray-300 group-hover:text-[#002147] transition-colors">
                {step.num}
              </span>
            </div>
            
            <h4 className="text-lg font-bold text-[#002147] mb-2 leading-snug">
              {step.title}
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed mt-auto">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UniversityEligibilityChecklist() {
  return (
    <div className="w-full bg-[#002147]/[0.02] border border-gray-100 rounded-3xl p-8 md:p-12 my-12">
      <div className="flex flex-col lg:flex-row gap-10 items-start">
        <div className="lg:w-1/3">
          <span className="text-[#F9010D] font-bold text-xs uppercase tracking-widest block mb-2">
            Verification Norms
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-[#002147] leading-tight mb-4">
            Credit Transfer Eligibility & Document Norms
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            University credit recognition is governed by UGC / AICTE statutory framework norms. Review the core eligibility criteria and document requirements before applying.
          </p>
          <div className="p-4 bg-white rounded-2xl border border-gray-200/80 shadow-sm">
            <div className="flex items-center gap-2 text-[#002147] font-bold text-sm mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              UGC & NHEQF Aligned
            </div>
            <p className="text-xs text-gray-500 leading-normal">
              Credit transfer caps and semester exemptions comply with National Higher Education Qualifications Framework regulations.
            </p>
          </div>
        </div>

        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-[#002147] text-base mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#F9010D]" />
              Academic Eligibility Criteria
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Recognized Prior Institution:</strong> Previous university must be recognized by UGC, AICTE, or State Technical Board.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Passing Grade in Transferred Subjects:</strong> Credits can only be claimed for subjects successfully passed with authentic grade records.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Statutory Credit Cap:</strong> Maximum transferable credits typically up to 50% of total degree credits, adhering to university norms.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Discontinued / Lateral Candidates:</strong> Open to engineering, polytechnic, and regular degree students seeking academic resumption.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h4 className="font-bold text-[#002147] text-base mb-4 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-[#F9010D]" />
              Mandatory Documentation
            </h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Grade Sheets:</strong> Authentic mark sheets of all completed semesters/years from prior institution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Syllabus Copy:</strong> Official syllabus of completed courses for equivalency review by the university board.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Migration / TC:</strong> Transfer Certificate, Migration, or Discontinuation letter from previous institution.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#F9010D] font-bold mt-0.5">•</span>
                <span><strong>Identity Credentials:</strong> Valid Government ID proof (Aadhaar / Passport) and passport-size photographs.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

