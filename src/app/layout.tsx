import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import SmoothScroll from '@/components/SmoothScroll';
import { SITE_NAME, SITE_URL, websiteJsonLd } from '@/lib/seo';

const montserrat = Montserrat({ subsets: ['latin'] });

const DEFAULT_TITLE = 'Edumentora - Credit Transfer Institution in Kerala';
const DEFAULT_DESCRIPTION = 'Resume your education with Academic Credit Transfer guidance in Kerala.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: '/favcon/edumentora_favcon.png',
    shortcut: '/favcon/edumentora_favcon.png',
    apple: '/favcon/edumentora_favcon.png',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/favcon/edumentora_favcon.png'],
  },
  twitter: {
    card: 'summary',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/favcon/edumentora_favcon.png'],
  },
};

// Organization schema, built only from facts already published in the
// footer and on /contact (phone/email/office addresses) — no new claims,
// nothing invented. No geo coordinates: none are verifiable from existing
// project data, so none are included (see ContactClient.tsx for the source
// addresses these mirror, verbatim).
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'Edumentora Services LLP',
  alternateName: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favcon/edumentora_favcon.png`,
  email: 'info@edumentora.com',
  telephone: '+91-9744587777',
  address: [
    {
      '@type': 'PostalAddress',
      streetAddress: 'YMCA Cross Road',
      addressLocality: 'Kozhikode',
      addressRegion: 'Kerala',
      postalCode: '673001',
      addressCountry: 'IN',
    },
    {
      '@type': 'PostalAddress',
      streetAddress: '6th Floor, National Pearl Star Building, Near Changampuzha Park Metro Station, Edappally',
      addressLocality: 'Kochi',
      addressRegion: 'Kerala',
      postalCode: '682024',
      addressCountry: 'IN',
    },
  ],
  // Kept to the state + the office cities + the 15 city landing pages the
  // site actually publishes (src/app/b-tech-credit-transfer-<city>/) —
  // nothing added beyond what already has a real page.
  areaServed: [
    'Calicut', 'Kochi', 'Kerala',
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
    'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
    'Thiruvananthapuram', 'Thrissur', 'Wayanad',
  ],
  sameAs: [
    'https://www.facebook.com/edumentoradotcom/',
    'https://www.instagram.com/edumentora/?hl=en',
    'https://www.linkedin.com/company/edumentora/home/',
  ],
};

import PopupForm from '@/components/PopupForm';
import LogoIntro from '@/components/LogoIntro';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        />
        <LogoIntro />
        <SmoothScroll>
          {children}
          <PopupForm />
        </SmoothScroll>
      </body>
    </html>
  );
}
