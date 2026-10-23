import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import { ArrowRight } from 'lucide-react';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const dynamic = 'force-dynamic';

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

function SectionCard({
  title,
  count,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  title: string;
  count: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#002147]">{title} <span className="text-gray-400 font-medium text-sm">({count})</span></h2>
        {viewAllHref && (
          <Link href={viewAllHref} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#002147] hover:text-[#F9010D] transition-colors">
            {viewAllLabel || 'View All'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-6 py-3 font-semibold text-gray-700 text-xs uppercase tracking-wider">{children}</th>;
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-6 py-3.5 text-sm ${className}`}>{children}</td>;
}

function EmptyRow({ colSpan, label }: { colSpan: number; label: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-gray-500">{label}</td>
    </tr>
  );
}

export default async function AdminDashboard() {
  const [
    enquiries,
    eligibilityRequests,
    universities,
    contacts,
    blogs,
    programs,
    enquiryCount,
    eligibilityCount,
    blogCount,
    universityCount,
    universityProgramCount,
    programCount,
  ] = await Promise.all([
    prisma.enquiryList.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.eligibilityRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.university.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.contact.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.blog.findMany({ orderBy: { date: 'desc' }, take: 3 }),
    prisma.program.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.enquiryList.count(),
    prisma.eligibilityRequest.count(),
    prisma.blog.count(),
    prisma.university.count(),
    prisma.universityProgram.count(),
    prisma.program.count(),
  ]);

  return (
    <div className="p-8 font-[Poppins] space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to Edumentora Admin. Here&rsquo;s a quick overview of your latest activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-32">
          <p className="text-gray-500 font-medium mb-1">Total Enquiries</p>
          <h2 className="text-4xl font-bold text-[#002147]">{enquiryCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-32">
          <p className="text-gray-500 font-medium mb-1">Eligibility Requests</p>
          <h2 className="text-4xl font-bold text-[#002147]">{eligibilityCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-32">
          <p className="text-gray-500 font-medium mb-1">Published Blogs</p>
          <h2 className="text-4xl font-bold text-[#002147]">{blogCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-32">
          <p className="text-gray-500 font-medium mb-1">Total Universities</p>
          <h2 className="text-4xl font-bold text-[#002147]">{universityCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-32">
          <p className="text-gray-500 font-medium mb-1">Available University Programs</p>
          <h2 className="text-4xl font-bold text-[#002147]">{universityProgramCount}</h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center h-32">
          <p className="text-gray-500 font-medium mb-1">Total Programs</p>
          <h2 className="text-4xl font-bold text-[#002147]">{programCount}</h2>
        </div>
      </div>

      {/* Recent Enquiries */}
      <SectionCard title="Recent Enquiries" count={enquiryCount} viewAllHref="/admin/enquiries">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <Th>Date</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Phone</Th>
                <Th>Email</Th>
                <Th>Company</Th>
                <Th>Message</Th>
                <Th>Source</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.length === 0 && <EmptyRow colSpan={8} label="No enquiries yet." />}
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="text-gray-500 whitespace-nowrap">{formatDate(e.createdAt)}</Td>
                  <Td className="font-medium text-gray-900 whitespace-nowrap">{e.firstName}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{e.lastName || '-'}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{e.phone}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{e.email}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{e.company || '-'}</Td>
                  <Td className="text-gray-600 max-w-xs truncate" >{e.message}</Td>
                  <Td className="text-gray-600 max-w-xs truncate" >{e.source}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Recent Eligibility Requests */}
      <SectionCard title="Recent Eligibility Requests" count={eligibilityCount} viewAllHref="/admin/enquiries?filter=ELIGIBILITY">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <Th>Date</Th>
                <Th>First Name</Th>
                <Th>Last Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Company</Th>
                <Th>Message</Th>
                <Th>Source</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {eligibilityRequests.length === 0 && <EmptyRow colSpan={8} label="No eligibility requests yet." />}
              {eligibilityRequests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="text-gray-500 whitespace-nowrap">{formatDate(r.createdAt)}</Td>
                  <Td className="font-medium text-gray-900 whitespace-nowrap">{r.firstName}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{r.lastName || '-'}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{r.email}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{r.phone}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{r.company || '-'}</Td>
                  <Td className="text-gray-600 max-w-xs truncate">{r.message}</Td>
                  <Td className="text-gray-600 max-w-xs truncate">{r.source}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Universities */}
      <SectionCard title="Universities" count={universities.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <Th>Name</Th>
                <Th>Location</Th>
                <Th>Certificates</Th>
                <Th>Added</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {universities.length === 0 && <EmptyRow colSpan={4} label="No universities added yet." />}
              {universities.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="font-medium text-gray-900 whitespace-nowrap">{u.name}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{u.location}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{u.certificates.length}</Td>
                  <Td className="text-gray-500 whitespace-nowrap">{formatDate(u.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Contacts */}
      <SectionCard title="Contacts" count={contacts.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <Th>Department</Th>
                <Th>Landline</Th>
                <Th>Mobile</Th>
                <Th>Email</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length === 0 && <EmptyRow colSpan={4} label="No contacts added yet." />}
              {contacts.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="font-medium text-gray-900 whitespace-nowrap">{c.department}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{c.lanphone}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{c.mob}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{c.email}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Recent Blogs */}
      <SectionCard title="Recent Blogs" count={blogCount} viewAllHref="/admin/blogs" viewAllLabel="Show All">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <Th>Title</Th>
                <Th>Category</Th>
                <Th>Date</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {blogs.length === 0 && <EmptyRow colSpan={3} label="No blogs published yet." />}
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="font-medium text-gray-900 max-w-md truncate">{b.sectionDis}</Td>
                  <Td className="text-gray-600 whitespace-nowrap">{b.category}</Td>
                  <Td className="text-gray-500 whitespace-nowrap">{formatDate(b.date)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Programs */}
      <SectionCard title="Programs" count={programs.length}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <Th>Topic</Th>
                <Th>Heading</Th>
                <Th>Created</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {programs.length === 0 && <EmptyRow colSpan={3} label="No programs added yet." />}
              {programs.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <Td className="font-medium text-gray-900 whitespace-nowrap">{p.topic}</Td>
                  <Td className="text-gray-600 max-w-md truncate">{p.heading}</Td>
                  <Td className="text-gray-500 whitespace-nowrap">{formatDate(p.createdAt)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
