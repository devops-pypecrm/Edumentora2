import React from 'react';
import PageBanner from '@/components/PageBanner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { pageMetadata } from '@/lib/seo';
import { PrismaClient } from '@prisma/client';
import { Bell, Clock } from 'lucide-react';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const revalidate = 3600;

export const metadata = pageMetadata({
  title: 'Notifications',
  description: 'Stay updated with the latest notifications and announcements from Edumentora.',
  path: '/notifications',
});

export default async function NotificationsPage() {
  // "Current" is whatever is enabled (status SHOW) in the admin panel, latest
  // first; "Previous" is everything disabled there (status HIDE).
  const [current, previous] = await Promise.all([
    prisma.notification.findMany({ where: { status: 'SHOW' }, orderBy: { createdAt: 'desc' } }),
    prisma.notification.findMany({ where: { status: 'HIDE' }, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <main className="min-h-screen bg-white font-[Poppins]">
      <Header />

      <PageBanner
        badge="Stay Updated"
        title="Notifications"
        subtitle="This is notifications page."
        isGradientText={true}
      />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
        {/* Left: Current Notifications — status SHOW in admin, latest first */}
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-bold text-[#002147] mb-6">
            <Bell className="w-6 h-6 text-[#E91D24]" />
            Current Notifications
          </h2>
          {current.length === 0 ? (
            <p className="text-gray-500">No current notifications right now.</p>
          ) : (
            <ul className="space-y-4">
              {current.map((n) => (
                <li key={n.id} className="rounded-xl border border-[#002147]/15 bg-white px-5 py-4 text-[#002147] font-medium">
                  {n.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Previous Notifications */}
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-bold text-[#002147] mb-6">
            <Clock className="w-6 h-6 text-[#E91D24]" />
            Previous Notifications
          </h2>
          {previous.length === 0 ? (
            <p className="text-gray-500">No previous notifications yet.</p>
          ) : (
            <ul className="space-y-4">
              {previous.map((n) => (
                <li key={n.id} className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-gray-700">
                  {n.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
