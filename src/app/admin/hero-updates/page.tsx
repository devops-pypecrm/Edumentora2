import { getHeroSectionContent } from './actions';
import HeroUpdatesManager from '@/components/admin/HeroUpdatesManager';

export const dynamic = 'force-dynamic';

export default async function HeroUpdatesAdminPage() {
  const heroContent = await getHeroSectionContent();

  return (
    <div className="p-8 font-[Poppins] space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#002147] mb-2">Hero Updates</h1>
        <p className="text-sm text-gray-500">
          Update the main heading, sub heading, paragraph, text colors, and eligibility form visibility in the homepage hero section.
        </p>
      </div>
      <HeroUpdatesManager initialContent={heroContent} />
    </div>
  );
}

