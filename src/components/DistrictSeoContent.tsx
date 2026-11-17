import Link from 'next/link';

// Extra location SEO content shown on the B.Tech credit transfer district
// pages (src/app/b-tech-credit-transfer-<district>/). Built only from facts
// already published on the site (process steps, documents, offices).
const DISTRICTS: Record<string, { name: string; path: string }> = {
  alappuzha: { name: 'Alappuzha', path: '/b-tech-credit-transfer-alappuzha' },
  ernakulam: { name: 'Ernakulam', path: '/b-tech-credit-transfer-ernakulam' },
  idukki: { name: 'Idukki', path: '/b-tech-credit-transfer-idukki' },
  kochi: { name: 'Kochi', path: '/b-tech-credit-transfer-in-kochi' },
  kannur: { name: 'Kannur', path: '/b-tech-credit-transfer-kannur' },
  kasaragod: { name: 'Kasaragod', path: '/b-tech-credit-transfer-kasaragod' },
  kollam: { name: 'Kollam', path: '/b-tech-credit-transfer-kollam' },
  kottayam: { name: 'Kottayam', path: '/b-tech-credit-transfer-kottayam' },
  kozhikode: { name: 'Kozhikode', path: '/b-tech-credit-transfer-kozhikode' },
  malappuram: { name: 'Malappuram', path: '/b-tech-credit-transfer-malappuram' },
  palakkad: { name: 'Palakkad', path: '/b-tech-credit-transfer-palakkad' },
  pathanamthitta: { name: 'Pathanamthitta', path: '/b-tech-credit-transfer-pathanamthitta' },
  thiruvananthapuram: { name: 'Thiruvananthapuram', path: '/b-tech-credit-transfer-thiruvananthapuram' },
  thrissur: { name: 'Thrissur', path: '/b-tech-credit-transfer-thrissur' },
  wayanad: { name: 'Wayanad', path: '/b-tech-credit-transfer-wayanad' },
};

const STEPS = [
  { title: 'Start Application', text: 'Share your course details and the semesters you have completed.' },
  { title: 'Document Verification', text: 'Submit your mark sheets, syllabus and academic records.' },
  { title: 'Review & Evaluation', text: 'Your earned credits are assessed against the new university syllabus.' },
  { title: 'Seat Reservation', text: 'Join the right semester at a suitable UGC-approved university.' },
];

export default function DistrictSeoContent({
  district,
  extrasOnly = false,
}: {
  district: string;
  /** Skip the main content block (for pages that already have their own) and show only the extras. */
  extrasOnly?: boolean;
}) {
  const current = DISTRICTS[district];
  if (!current) return null;
  const { name } = current;
  const others = Object.entries(DISTRICTS).filter(([key]) => key !== district);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12 space-y-10 text-[#3b3226]">
      {!extrasOnly && (
        <div className="space-y-5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#002147]">How B.Tech Credit Transfer Works in {name}</h2>
          <p className="text-base leading-relaxed text-justify">
            Students from {name} who discontinued their B.Tech, because of backlogs, relocation, financial or personal
            reasons, can continue their degree without starting over. Through academic credit transfer, the credits you
            have already earned are moved to a UGC-approved university, so you can join an advanced semester and finish
            your engineering degree on time. No entrance exam is required; only your academic records are evaluated.
          </p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#F9010D] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mb-1 font-bold text-[#002147]">{step.title}</h3>
                <p className="text-sm leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-[#002147]">B.Tech Credit Transfer Across Kerala</h2>
        <p className="text-base leading-relaxed text-justify">
          Edumentora guides students in {name} and every district of Kerala from our offices in Calicut (Kozhikode) and
          Kochi. Call +91 974458 7777 or email info@edumentora.com for a free consultation.
        </p>
        <ul className="flex flex-wrap gap-2">
          {others.map(([key, item]) => (
            <li key={key}>
              <Link
                href={item.path}
                className="inline-block rounded-full border border-gray-300 px-4 py-1.5 text-sm text-[#002147] transition-colors hover:border-[#F9010D] hover:text-[#F9010D]"
              >
                B.Tech Credit Transfer {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
