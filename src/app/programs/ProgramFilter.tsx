'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type Program = {
  id: string;
  topic: string;
  heroImage: string | null;
  heading: string;
  subHeading: string | null;
  paragraph: string;
  blocks: any[];
};

// ─── Mini Components ──────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="w-10 h-1 bg-[#F9010D] rounded-full" />
      <div className="w-4 h-1 bg-[#F9010D]/40 rounded-full" />
    </div>
  );
}

function TextBlock({ block, bIndex }: { block: any; bIndex: number }) {
  return (
    <div className="bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-sm">
      <h3 className="text-2xl md:text-3xl font-bold text-[#002147] mb-2">{block.heading}</h3>
      <SectionDivider />
      {block.paragraph && (
        <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-4 whitespace-pre-line">
          {block.paragraph}
        </p>
      )}
    </div>
  );
}

function CardsBlock({ block, bIndex }: { block: any; bIndex: number }) {
  const count = block.cards?.length ?? 0;
  const gridCols =
    count === 1
      ? 'grid-cols-1 max-w-xl mx-auto'
      : count === 2
      ? 'grid-cols-1 sm:grid-cols-2'
      : count === 4
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-[#002147] mb-2">{block.heading}</h3>
        <SectionDivider />
        {block.paragraph && (
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-4">
            {block.paragraph}
          </p>
        )}
      </div>

      <div className={`grid ${gridCols} gap-6`}>
        {block.cards.map((card: any, cIndex: number) => (
          <div
            key={cIndex}
            className="group bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-[#002147] hover:shadow-lg transition-all duration-300 relative overflow-hidden"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F9010D] to-[#002147] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
            {/* Card number */}
            <div className="w-10 h-10 rounded-xl bg-[#002147]/8 flex items-center justify-center mb-4">
              <span className="text-[#002147] font-extrabold text-sm">{String(cIndex + 1).padStart(2, '0')}</span>
            </div>
            <h4 className="text-lg md:text-xl font-bold text-[#002147] mb-3">{card.cardHeading}</h4>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">{card.cardPara}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArrowsBlock({ block, bIndex }: { block: any; bIndex: number }) {
  return (
    <div>
      <div className="mb-8">
        <h3 className="text-2xl md:text-3xl font-bold text-[#002147] mb-2">{block.heading}</h3>
        <SectionDivider />
        {block.paragraph && (
          <p className="text-gray-600 text-base md:text-lg leading-relaxed mt-4">
            {block.paragraph}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {block.points.map((point: any, pIndex: number) => (
          <div
            key={pIndex}
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-[#002147]/40 hover:shadow-md transition-all duration-300"
          >
            {point.pointHeading && (
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-[#F9010D] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">{pIndex + 1}</span>
                </div>
                <h4 className="text-lg font-bold text-[#002147]">{point.pointHeading}</h4>
              </div>
            )}
            <ul className="space-y-3">
              {point.pointList.map((item: string, lIndex: number) => (
                <li key={lIndex} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#002147]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#002147] font-bold" style={{ fontSize: '10px' }}>→</span>
                  </div>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApprenticeshipBlock({ block }: { block: any }) {
  const data = block.data;

  const overviews = data.overviews || (data.overview ? [data.overview] : []);
  const howItWorksBlocks = data.howItWorksBlocks || (data.howItWorks ? [{ sectionTitle: data.howItWorksSectionTitle, steps: data.howItWorks }] : []);
  const programsBlocks = data.programsBlocks || (data.programsAndEligibility ? [data.programsAndEligibility] : []);
  const whyChooseBlocks = data.whyChooseBlocks || (data.whyChoose ? [data.whyChoose] : []);

  return (
    <div className="w-full">
      {/* OVERVIEW SECTIONS */}
      {overviews.map((overview: any, idx: number) => (
        <div key={idx} className={`bg-white ${idx !== overviews.length - 1 ? 'border-b border-gray-200' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 md:px-8 py-20 text-left space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147]">{overview.heading}</h2>
            <h3 className="text-xl md:text-2xl font-semibold text-[#F9010D] leading-relaxed">{overview.subHeading}</h3>
            <p className="text-lg text-gray-700 leading-relaxed text-left mt-6 whitespace-pre-line">{overview.paragraph}</p>
          </div>
        </div>
      ))}

      {/* HOW IT WORKS SECTIONS */}
      {howItWorksBlocks.map((block: any, idx: number) => {
        const steps = block.steps || block.howItWorks || [];
        if (steps.length === 0) return null;
        return (
          <div key={idx} className={`max-w-7xl mx-auto px-4 md:px-8 py-20 bg-white ${idx !== howItWorksBlocks.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-16">{block.sectionTitle || 'How it Works'}</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item: any, i: number) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="w-14 h-14 bg-[#F9010D]/10 text-[#F9010D] rounded-2xl flex items-center justify-center font-black text-2xl mb-6 shadow-sm border border-[#F9010D]/25">{i + 1}</div>
                  <h3 className="text-xl font-bold text-[#002147] mb-4">{item.heading}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* PROGRAMS AND ELIGIBILITY SECTIONS */}
      {programsBlocks.map((block: any, idx: number) => {
        const title = block.sectionTitle || block.title || 'Programs & Eligibility';
        return (
          <div key={idx} className={`bg-white text-[#002147] py-20 ${idx !== programsBlocks.length - 1 ? 'border-b border-[#002147]/10' : ''}`}>
            <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>

                {block.ugPrograms?.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-[#F9010D] mb-6 border-b border-[#002147]/15 pb-4">Undergraduate Programs</h3>
                    <ul className="space-y-4 text-lg text-gray-600 mb-10">
                      {block.ugPrograms.map((p: string, i: number) => (
                        <li key={i} className="flex items-start"><span className="text-[#F9010D] mr-3 font-bold text-xl">➤</span> <span>{p}</span></li>
                      ))}
                    </ul>
                  </>
                )}

                {block.pgPrograms?.length > 0 && (
                  <>
                    <h3 className="text-xl font-semibold text-[#F9010D] mb-6 border-b border-[#002147]/15 pb-4">Postgraduate Programs</h3>
                    <ul className="space-y-4 text-lg text-gray-600">
                      {block.pgPrograms.map((p: string, i: number) => (
                        <li key={i} className="flex items-start"><span className="text-[#F9010D] mr-3 font-bold text-xl">➤</span> <span>{p}</span></li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              {block.whoCanApply?.length > 0 && (
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-8">Who Can Apply?</h2>
                  <ul className="space-y-4 text-lg text-gray-600">
                    {block.whoCanApply.map((p: string, i: number) => (
                      <li key={i} className="flex items-start"><span className="text-[#F9010D] mr-3 font-bold text-xl">➤</span> <span>{p}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* WHY CHOOSE SECTIONS */}
      {whyChooseBlocks.map((block: any, idx: number) => {
        const title = block.sectionTitle || block.title || 'Why Choose?';
        return (
          <div key={idx} className={`bg-white py-20 ${idx !== whyChooseBlocks.length - 1 ? 'border-b border-gray-100' : ''}`}>
            <div className="max-w-4xl mx-auto px-4 md:px-8">
              <h2 className="text-3xl md:text-4xl font-bold text-[#002147] text-center mb-10">{title}</h2>
              <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm">
                <ul className="space-y-5 text-lg text-gray-700 mb-10">
                  {block.points?.map((pt: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-[#F9010D] mr-3 font-bold text-xl">➤</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                {block.conclusion && (
                  <p className="text-lg text-gray-800 leading-relaxed text-center font-medium border-t border-gray-200 pt-8 whitespace-pre-line">
                    {block.conclusion}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ProgramFilter({ programs }: { programs: Program[] }) {
  const searchParams = useSearchParams();
  const topicParam = searchParams.get('topic');

  const topics = useMemo(() => {
    const uniqueTopics = new Set<string>();
    programs.forEach((p) => uniqueTopics.add(p.topic));
    return Array.from(uniqueTopics);
  }, [programs]);

  const [activeTopic, setActiveTopic] = useState<string>('');

  useEffect(() => {
    if (topicParam && topics.includes(topicParam)) {
      setActiveTopic(topicParam);
    }
  }, [topicParam, topics]);

  // Default to the first topic if none is selected
  const currentTopic = activeTopic || (topicParam && topics.includes(topicParam) ? topicParam : (topics.length > 0 ? topics[0] : ''));

  const filteredPrograms = useMemo(() => {
    if (!currentTopic) return [];
    return programs.filter((p) => p.topic === currentTopic);
  }, [programs, currentTopic]);

  if (programs.length === 0) {
    return (
      <div className="py-32 text-center text-gray-500 bg-gray-50">
        <div className="inline-block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">📚</span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-[#002147] mb-3">No Programs Available</h2>
        <p className="text-gray-500">Please add programs from the Admin Panel.</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">

      {/* ── FILTER BAR ─────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 sticky top-[76px] z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`px-5 md:px-7 py-2 md:py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  currentTopic === topic
                    ? 'bg-[#002147] text-white shadow-md shadow-[#002147]/20 scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-[#002147]/10 hover:text-[#002147]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PROGRAMS LIST ───────────────────────────────────────────── */}
      {filteredPrograms.length === 0 ? (
        <div className="text-center text-gray-500 py-24">
          <p className="text-lg">No programs found for this topic.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {filteredPrograms.map((program, index) => (
            <div key={program.id} className="w-full bg-white">

              {/* ── PROGRAM INTRO HERO ─────────────────────────────── */}
              <div
                className={`max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-10 lg:gap-16 items-center`}
              >
                {/* Image */}
                {program.heroImage && (
                  <div className="w-full lg:w-5/12 flex-shrink-0">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl group aspect-[4/3]">
                      <img
                        src={program.heroImage}
                        alt={program.heading}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                      />
                      {/* Topic badge on image */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-[#002147] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg backdrop-blur-sm">
                          {program.topic}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Text Content */}
                <div className={`w-full ${program.heroImage ? 'lg:w-7/12' : 'lg:w-full max-w-4xl mx-auto'}`}>
                  {/* Topic pill (shown when no image) */}
                  {!program.heroImage && (
                    <span className="inline-block px-4 py-1.5 bg-[#002147]/8 text-[#002147] font-bold text-xs uppercase tracking-wider rounded-full mb-4">
                      {program.topic}
                    </span>
                  )}

                  {program.subHeading && (
                    <p className="text-[#F9010D] font-bold text-sm md:text-base uppercase tracking-widest mb-3">
                      {program.subHeading}
                    </p>
                  )}

                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#002147] leading-tight mb-4">
                    {program.heading}
                  </h2>

                  <div className="w-12 h-1 bg-[#F9010D] rounded-full mb-6" />

                  <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-8">
                    {program.paragraph}
                  </p>

                  <Link
                    href="/about-us"
                    className="inline-flex items-center gap-2 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 group text-base"
                  >
                    Know More
                    <span className="transform transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>

            {/* ── DYNAMIC CANVAS WIDGETS ─────────────────────────────────── */}
              {program.blocks && program.blocks.length > 0 && (
                <>
                  {program.blocks.map((w: Record<string, any>, bIndex: number) => {
                    if (w.type === 'apprenticeship-layout') {
                      return <ApprenticeshipBlock key={bIndex} block={w} />;
                    }
                    return null;
                  })}

                  {program.blocks.some((w: any) => w.type !== 'apprenticeship-layout') && (
                    <div className="bg-gray-50 border-t border-gray-100">
                      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min md:auto-rows-[60px]">
                          {program.blocks.filter((w: any) => w.type !== 'apprenticeship-layout').map((w: Record<string, any>, bIndex: number) => {
                            // Legacy Block Support (blocks created before canvas builder)
                            if (!w.i) {
                              return (
                                <div key={bIndex} className="col-span-1 md:col-span-12 space-y-6 mb-6">
                                  {w.type === 'text' && <TextBlock block={w} bIndex={bIndex} />}
                                  {w.type === 'cards' && <CardsBlock block={w} bIndex={bIndex} />}
                                  {w.type === 'arrows' && <ArrowsBlock block={w} bIndex={bIndex} />}
                                </div>
                              );
                            }

                            // New Canvas Widget
                            return (
                              <div
                                key={w.i as string}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md hover:border-[#002147]/30 transition-all overflow-hidden flex flex-col"
                                style={{
                                  gridColumn: `var(--grid-col, 1 / -1)`,
                                  gridRow: `var(--grid-row, auto)`,
                                  '--grid-col': `${w.x + 1} / span ${w.w}`,
                                  '--grid-row': `${w.y + 1} / span ${w.h}`
                                } as any}
                              >
                              {w.type === 'text' && (
                                <div>
                                  <h3 className="text-2xl font-bold text-[#002147] mb-3">{w.data?.heading}</h3>
                                  <div className="w-10 h-1 bg-[#F9010D] rounded mb-4" />
                                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{w.data?.paragraph}</p>
                                </div>
                              )}

                              {w.type === 'card' && (
                                <div className="flex flex-col h-full relative group">
                                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F9010D] to-[#002147] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                                  <div className="w-12 h-12 rounded-xl bg-[#002147]/8 flex items-center justify-center mb-5 mt-2">
                                    <span className="text-[#002147] font-extrabold text-sm">{String(w.i).slice(0,2).toUpperCase()}</span>
                                  </div>
                                  <h4 className="text-xl font-bold text-[#002147] mb-3">{w.data?.heading}</h4>
                                  <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-1">{w.data?.paragraph}</p>
                                </div>
                              )}

                              {w.type === 'arrow-list' && (
                                <div className="flex flex-col h-full">
                                  <h3 className="text-xl font-bold text-[#002147] mb-5 pb-4 border-b border-gray-100">{w.data?.heading}</h3>
                                  <ul className="space-y-3 flex-1">
                                    {w.data?.points?.map((pt: string, idx: number) => (
                                      <li key={idx} className="flex items-start gap-3 text-gray-600">
                                        <div className="mt-1 w-5 h-5 rounded bg-[#F9010D]/10 flex items-center justify-center flex-shrink-0">
                                          <span className="text-[#F9010D] font-bold text-xs">→</span>
                                        </div>
                                        <span className="text-sm md:text-base">{pt}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {w.type === 'image' && (
                                <div className="w-full h-full rounded-xl overflow-hidden shadow-sm relative group/img -m-6 md:-m-8" style={{ width: 'calc(100% + 3rem)' }}>
                                  {w.data?.url ? (
                                    <img src={w.data.url} alt="Program Image" className="w-full h-full object-cover transform transition-transform duration-700 group-hover/img:scale-105" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                      <span className="text-sm font-semibold">Image Placeholder</span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
