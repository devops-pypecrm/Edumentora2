import Link from 'next/link';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Students Login',
  description: 'Log in to your Edumentora student account.',
};

const doodles = [
  { left: '4%', top: '10%', width: '190px', rotate: '-14deg', opacity: 0.2 },
  { left: '18%', top: '64%', width: '230px', rotate: '18deg', opacity: 0.18 },
  { left: '46%', top: '12%', width: '180px', rotate: '8deg', opacity: 0.16 },
  { left: '73%', top: '8%', width: '230px', rotate: '-8deg', opacity: 0.2 },
  { left: '82%', top: '62%', width: '200px', rotate: '16deg', opacity: 0.16 },
];

export default function StudentsLoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#eaf1fb] font-[Poppins] text-[#002147]">
      <Header />

      <section className="relative flex min-h-[calc(100vh-82px)] items-center overflow-hidden px-5 pb-20 pt-32 md:px-10 lg:px-16">
        <div className="pointer-events-none absolute inset-0 z-0">
          {doodles.map((doodle, index) => (
            <img
              key={index}
              src="/favcon/edumentora_favcon.png"
              alt=""
              aria-hidden="true"
              className="absolute select-none"
              style={{
                left: doodle.left,
                top: doodle.top,
                width: doodle.width,
                transform: `rotate(${doodle.rotate})`,
                opacity: doodle.opacity,
                filter: index % 2 === 0 ? 'saturate(1.4) brightness(1.2) contrast(1.1)' : 'saturate(1.1) brightness(1.15)',
              }}
            />
          ))}
        </div>
        <div className="pointer-events-none absolute inset-0 z-[1] bg-[#edf6ff]/65" />

        <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div className="max-w-xl">
            <p className="mb-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold shadow-[0_10px_30px_-10px_rgba(23,42,83,0.25)]">
              Student portal
            </p>
            <blockquote className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              “Your unfinished chapter is still part of your story. Keep going.”
            </blockquote>
            <div className="mt-8 flex items-center gap-3 text-base font-semibold text-[#002147]/70">
              <span className="h-1 w-12 rounded-full bg-[#F9010D]" />
              Your next step starts here.
            </div>
          </div>

          <div className="w-full max-w-md justify-self-center rounded-[2rem] border border-white/80 bg-white/95 p-7 shadow-[0_24px_70px_-28px_rgba(0,33,71,0.45)] sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#002147] text-white">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome back</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Log in to continue your student journey with Edumentora.</p>
            </div>

            <form className="space-y-5" method="post">
              <div>
                <label htmlFor="student-email" className="mb-2 block text-sm font-bold">Email address</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="student-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-[#002147] outline-none transition focus:border-[#002147] focus:bg-white focus:ring-4 focus:ring-[#002147]/10"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="student-password" className="block text-sm font-bold">Password</label>
                  {/* <button type="button" className="text-xs font-bold text-[#F9010D] hover:text-[#F9010D]">Forgot password?</button> */}
                </div>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <input
                    id="student-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm text-[#002147] outline-none transition focus:border-[#002147] focus:bg-white focus:ring-4 focus:ring-[#002147]/10"
                  />
                </div>
              </div>

              <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#F9010D] px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_8px_20px_rgba(249,1,13,0.25)] transition hover:-translate-y-0.5 hover:bg-[#F9010D]">
                Login
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              Need help accessing your account?{' '}
              <Link href="/contact" className="font-bold text-[#F9010D] hover:text-[#F9010D]">Contact us</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}