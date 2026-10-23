import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white font-[Poppins] flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32">
        <p className="text-[#F9010D] font-bold text-lg tracking-widest mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#002147] mb-4">Page not found</h1>
        <p className="text-gray-600 max-w-md mb-8">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <Footer />
    </main>
  );
}
