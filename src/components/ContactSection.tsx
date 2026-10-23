'use client';

import { useState } from 'react';
import { CheckCircle2, Clock, MapPin, Phone } from 'lucide-react';
import EnquiryForm from '@/components/EnquiryForm';

export default function ContactSection() {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="w-full px-4 py-8 md:px-8 bg-white">
      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-[32px] border border-white/15 bg-[#F9010D] p-6 text-white shadow-[0_24px_65px_rgba(249,1,13,0.24)] md:p-10">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full border-[52px] border-white/[0.06]" />
        <div aria-hidden className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-[#002147]/20" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-white/70 via-white/10 to-transparent" />
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="flex w-full flex-col space-y-6 rounded-[24px] border border-white/15 bg-black/10 p-5 md:p-6 lg:w-[42%]">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-white/65">Start your journey</p>
              <h2 className="text-2xl font-bold leading-tight md:text-3xl">Ready To Grow with Edumentora</h2>
            </div>

            <div className="border-l-4 border-white/40 pl-4">
              <p className="text-sm leading-relaxed text-white/90">
                Edumentora makes restarting your education easy by transferring past credits to accredited universities, saving you time and money.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] p-3">
                <div className="rounded-full bg-[#002147] p-2 shadow-lg shadow-black/20"><Clock className="size-4 text-white" /></div>
                <span className="text-sm font-medium">Fast Application Processing</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.08] p-3">
                <div className="rounded-full bg-[#002147] p-2 shadow-lg shadow-black/20"><CheckCircle2 className="size-4 text-white" /></div>
                <span className="text-sm font-medium">Successful Transfers</span>
              </div>
            </div>

            <div className="grid gap-4 pt-1 sm:grid-cols-2 lg:grid-cols-1">
              <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#002147] shadow-lg shadow-black/20"><Phone className="size-5 text-white" /></div>
                <div><p className="text-xs font-medium text-white/70">Call Us Anytime</p><p className="font-bold">+91 974458 7777</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#002147] shadow-lg shadow-black/20"><MapPin className="size-5 text-white" /></div>
                <div><p className="text-xs font-medium text-white/70">Location</p><p className="font-bold">Calicut &amp; Kochi</p></div>
              </div>
            </div>
          </div>

          <div className="hidden w-full flex-col justify-center rounded-[24px] border border-white/10 bg-white/[0.07] p-4 md:flex lg:w-[58%]">
            <EnquiryForm className="space-y-4" isGrid={false} />
          </div>

          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setShowForm((visible) => !visible)}
              aria-expanded={showForm}
              className="w-full rounded-xl bg-[#002147] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-black/30"
            >
              {showForm ? 'Hide Form' : 'Send Your Message'}
            </button>

            {showForm && (
              <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.07] p-3">
                <EnquiryForm className="space-y-4" isGrid={false} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
