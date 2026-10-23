import React from 'react';
import Header from '@/components/Header';
import LocationsSection from '@/components/LocationsSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import PageBanner from '@/components/PageBanner';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ArrowLeft, Send } from 'lucide-react';
import { notFound } from 'next/navigation';
import { postComment } from './actions';
import type { Metadata } from 'next';
import { pageMetadata, articleJsonLd, breadcrumbJsonLd } from '@/lib/seo';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const revalidate = 3600;

// Renders one block's subPara as rich content instead of a flat string:
//  - a run of lines starting with "|" is treated as a markdown-style table
//    and rendered as a real <table>
//  - "[label](/path)" inside any other line becomes an internal <Link>
// Existing blog content contains neither "|" nor "[...](...)" (verified
// against the current dataset), so this is purely additive — every
// previously-published post renders exactly as before.
function renderInlineLinks(text: string, keyPrefix: string) {
  const linkPattern = /\[([^\]]+)\]\((\/[^)]+)\)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    nodes.push(
      <Link key={`${keyPrefix}-link-${i++}`} href={match[2]} className="text-[#F9010D] font-semibold underline decoration-[#F9010D] underline-offset-2 hover:text-[#F9010D]">
        {match[1]}
      </Link>
    );
    lastIndex = linkPattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function BlogParagraph({ subPara, blockKey }: { subPara: string; blockKey: string }) {
  const lines = subPara.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;
  let paraBuffer: string[] = [];
  let listBuffer: string[] = [];

  const flushPara = () => {
    if (paraBuffer.length === 0) return;
    const text = paraBuffer.join('\n');
    elements.push(
      <p key={`${blockKey}-p-${elements.length}`} className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap mb-4 last:mb-0">
        {renderInlineLinks(text, `${blockKey}-p-${elements.length}`)}
      </p>
    );
    paraBuffer = [];
  };

  const flushList = () => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={`${blockKey}-ul-${elements.length}`} className="list-disc pl-6 space-y-1.5 text-lg text-gray-700 leading-relaxed mb-4">
        {listBuffer.map((item, idx) => (
          <li key={`${blockKey}-li-${idx}`}>{renderInlineLinks(item, `${blockKey}-li-${idx}`)}</li>
        ))}
      </ul>
    );
    listBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith('|')) {
      flushPara();
      flushList();
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines
        .map((l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
        .filter((cells) => !cells.every((c) => /^:?-+:?$/.test(c))); // drop the "---" separator row
      const [headerRow, ...bodyRows] = rows;
      if (headerRow) {
        elements.push(
          <div key={`${blockKey}-table-${elements.length}`} className="overflow-x-auto mb-6 rounded-xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#002147]/5">
                  {headerRow.map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 text-sm font-bold text-[#002147] border-b border-gray-200">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((cells, rIdx) => (
                  <tr key={rIdx} className="odd:bg-white even:bg-gray-50">
                    {cells.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-sm text-gray-700 align-top border-b border-gray-100 last:border-b-0">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      flushPara();
      listBuffer.push(line.replace(/^\s*[-*]\s+/, ''));
      i++;
      continue;
    }
    if (line.trim() === '') {
      flushPara();
      flushList();
      i++;
      continue;
    }
    flushList();
    paraBuffer.push(line);
    i++;
  }
  flushPara();
  flushList();

  return <>{elements}</>;
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await props.params;
  if (!id || id.length !== 24) return {};

  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) return {};

  const excerpt = blog.mainDis.find((block) => block.subPara)?.subPara ?? blog.sectionDis;

  return pageMetadata({
    title: blog.sectionDis,
    description: excerpt.length > 160 ? `${excerpt.slice(0, 157)}...` : excerpt,
    path: `/blog/${id}`,
  });
}

export default async function BlogDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  if (!id || id.length !== 24) {
    notFound();
  }

  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  if (!blog) {
    notFound();
  }

  const recentBlogs = await prisma.blog.findMany({
    where: { id: { not: id } },
    orderBy: { date: 'desc' },
    take: 5,
  });

  const comments = await prisma.comment.findMany({
    where: { blogId: id },
    orderBy: { createdAt: 'desc' },
  });

  const excerpt = blog.mainDis.find((block) => block.subPara)?.subPara ?? blog.sectionDis;
  const articleLd = articleJsonLd({
    headline: blog.sectionDis,
    description: excerpt.length > 300 ? `${excerpt.slice(0, 297)}...` : excerpt,
    image: blog.mainImage,
    author: blog.author,
    datePublished: blog.date,
    dateModified: blog.updatedAt,
    path: `/blog/${id}`,
  });
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: blog.sectionDis, path: `/blog/${id}` },
  ]);

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Header />
      
      <PageBanner badge={blog.category} title={blog.sectionDis} isGradientText={true}>
        <div className="pt-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all blogs
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-white/10 text-[#F9010D] text-sm font-semibold rounded-full border border-white/20 backdrop-blur-md">
              {blog.category}
            </span>
            <div className="flex items-center gap-2 text-white/70 text-sm font-medium">
              <Calendar className="w-4 h-4" />
              {new Date(blog.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#002147] leading-tight mb-8 max-w-4xl tracking-tight font-[Poppins]">
            {blog.sectionDis}
          </h1>
        </div>
      </PageBanner>

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative z-10">
          
          {/* Left Column: Blog Content */}
          <article className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {blog.mainImage && (
              <div className="relative w-full h-[300px] md:h-[450px] overflow-hidden">
                <Image
                  src={blog.mainImage}
                  alt={blog.sectionDis}
                  fill
                  unoptimized
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:text-[#002147] prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed">
                {blog.mainDis.map((block, index) => (
                  <div key={index} className="mb-10 last:mb-0">
                    {block.subHeading && (
                      <h2 className="text-2xl md:text-3xl font-bold text-[#002147] mb-4">
                        {block.subHeading}
                      </h2>
                    )}
                    {block.subPara && (
                      <BlogParagraph subPara={block.subPara} blockKey={`block-${index}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Right Column: Sidebar */}
          <div className="space-y-8 mt-16 lg:mt-0">
            
            {/* Recent Blogs */}
            {recentBlogs.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-[#002147] mb-6 pb-4 border-b border-gray-100">
                  Recent Blogs
                </h3>
                <div className="space-y-6">
                  {recentBlogs.map((recent) => (
                    <Link key={recent.id} href={`/blog/${recent.id}`} className="group flex gap-4 items-start">
                      {recent.mainImage ? (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={recent.mainImage}
                            alt={recent.sectionDis}
                            fill
                            unoptimized
                            sizes="80px"
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                          <span className="text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-[#002147] line-clamp-2 group-hover:text-[#F9010D] transition-colors mb-1">
                          {recent.sectionDis}
                        </h4>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(recent.date).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Comment Form */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h3 className="text-xl font-bold text-[#002147] mb-6 pb-4 border-b border-gray-100">
                Write your comment Here
              </h3>
              <form action={postComment} className="space-y-4">
                <input type="hidden" name="blogId" value={blog.id} />
                <div>
                  <input type="text" name="name" placeholder="Your Name *" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all text-sm text-[#002147] placeholder:text-[#002147]/70" />
                </div>
                <div>
                  <input type="email" name="email" placeholder="Your Email *" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all text-sm text-[#002147] placeholder:text-[#002147]/70" />
                </div>
                <div>
                  <input type="url" name="website" placeholder="Website (Optional)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all text-sm text-[#002147] placeholder:text-[#002147]/70" />
                </div>
                <div>
                  <textarea name="content" placeholder="Comment *" required rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#002147]/20 focus:border-[#002147] transition-all resize-none text-sm text-[#002147] placeholder:text-[#002147]/70"></textarea>
                </div>
                <button type="submit" className="w-full py-3 bg-[#F9010D] hover:bg-[#F9010D] text-white font-bold rounded-xl transition-colors duration-300 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Post comment
                </button>
              </form>
            </div>

            {/* Recent Comments */}
            {comments.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <h3 className="text-xl font-bold text-[#002147] mb-6 pb-4 border-b border-gray-100 flex items-center gap-2">
                  Recent comments <span className="bg-gray-100 text-[#002147] px-2 py-0.5 rounded-full text-xs">{comments.length}</span>
                </h3>
                
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-[#002147] text-sm">{comment.name}</h4>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
