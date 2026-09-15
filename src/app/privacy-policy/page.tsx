import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'Learn how Edumentora collects, uses, and shares your personal information.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white font-[Poppins] text-[#173763]">
      <Header />

      <section className="mx-auto min-h-[520px] max-w-7xl px-4 pb-24 pt-24 md:px-8 md:pb-32 md:pt-32">
        <h1 className="text-3xl font-bold leading-tight md:text-4xl">Privacy Policy</h1>

        <div className="mt-10 space-y-7 text-lg leading-relaxed md:text-xl">
          <p>Privacy Policy will be updated shortly.</p>
          <p>
            EDUMENTORA is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}