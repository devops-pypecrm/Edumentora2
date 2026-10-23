'use client';

import { Eye, Target } from 'lucide-react';

const items = [
  {
    number: '01',
    title: 'Our Mission',
    icon: Target,
    accent: '#F9010D',
    description:
      'To empower students to overcome academic setbacks through a seamless, fully supported credit transfer pathway. We respect every previously earned credit, guide learners toward UGC-accredited universities, and help turn educational interruptions into renewed opportunities for lifelong success.',
  },
  {
    number: '02',
    title: 'Our Vision',
    icon: Eye,
    accent: '#002147',
    description:
      'To create an inclusive educational landscape where no student is held back by past hurdles. We champion flexible learning pathways that let students complete higher education without starting over and transform previous progress into lasting achievement.',
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
