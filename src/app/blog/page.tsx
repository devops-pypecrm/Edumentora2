import React from 'react';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowRight } from 'lucide-react';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Blog',
  description: 'Stay updated with the latest news, guides, and insights about education and career.',
  path: '/blog',
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const revalidate = 3600;

export default async function BlogPage() {
  const blogs = await prisma.blog.findMany({
    orderBy: {
      date: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />
      
      <PageBanner 
        badge="Latest Insights" 
        title="Our Blog" 
        subtitle="Stay updated with the latest news, guides, and insights about education and career."
        isGradientText={true}
      />

      {/* Blogs Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#002147] mb-2">No blogs found</h2>
            <p className="text-gray-500">Check back later for new articles and insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 flex flex-col group">
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {blog.mainImage ? (
                    <Image
                      src={blog.mainImage}
                      alt={blog.sectionDis}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#002147]/5 text-[#002147]/30">
                      <span className="font-medium text-lg">Edumentora Blog</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 bg-[#E91D24] text-white text-sm font-semibold rounded-full shadow-lg">
                      {blog.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-4">
                    <Calendar className="w-4 h-4 text-[#E91D24]" />
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#002147] mb-4 line-clamp-2 leading-tight">
                    {blog.sectionDis}
                  </h3>
                  
                  <div className="mt-auto pt-6">
                    <Link 
                      href={`/blog/${blog.id}`}
                      className="inline-flex items-center gap-2 text-[#E91D24] font-bold hover:text-[#002147] transition-colors group/link"
                    >
                      Read Full Article 
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
<Footer />
      <FloatingWhatsApp />
    </main>
  );
}
