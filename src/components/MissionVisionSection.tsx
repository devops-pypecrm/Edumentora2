'use client';

import { Eye, Target } from 'lucide-react';

const items = [
  {
    number: '01',
    title: 'Our Mission',
    icon: Target,
    accent: '#F9010D',
    description:
      'To help students overcome academic setbacks by guiding them through credit transfer opportunities, making it easier to continue their education and achieve their goals.',
  },
  {
    number: '02',
    title: 'Our Vision',
    icon: Eye,
    accent: '#002147',
    description:
      'To build a future where every student has a second chance to succeed, with flexible learning pathways that recognize past progress and open doors to new opportunities.',
  },
];

export default function MissionVisionSection() {
  return (
    <section className="w-full bg-white py-14 md:py-20">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 px-5 md:grid-cols-2 md:px-8">
        {items.map((item, index) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
              className={`relative py-8 md:py-4 ${
                index === 0
                  ? 'border-b border-gray-200 md:border-b-0 md:border-r md:pr-12 lg:pr-16'
                  : 'md:pl-12 lg:pl-16'
              }`}
            >
              <div className="mb-7 flex items-center justify-between">
                <span
                  className="flex size-12 items-center justify-center rounded-full border"
                  style={{ borderColor: `${item.accent}33`, color: item.accent }}
                >
                  <Icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="text-sm font-bold tracking-[0.25em] text-gray-300">
                  {item.number}
                </span>
              </div>

              <h2 className="mb-4 text-3xl font-bold tracking-tight text-[#002147] md:text-4xl">
                {item.title}
              </h2>

              <div className="mb-6 h-1 w-12 rounded-full" style={{ backgroundColor: item.accent }} />

              <p className="max-w-xl text-[15px] leading-7 text-slate-600 md:text-base md:leading-8">
                {item.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
