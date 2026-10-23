import React from 'react';

interface PageBannerProps {
  title?: string;
  badge?: string;
  subtitle?: string;
  bgImage?: string;
  isGradientText?: boolean;
  /** Overrides the banner's background classes. Defaults to the standard light look. */
  bgClassName?: string;
  /** Overrides the badge text color classes. Defaults to the standard red/gradient look. */
  badgeClassName?: string;
  /** Overrides the title text color classes. Defaults to the standard dark/gradient look. */
  titleClassName?: string;
  /** Overrides the subtitle text color classes. Defaults to the standard navy look. */
  subtitleClassName?: string;
  /** Overrides the bottom border classes. Defaults to the standard light blue-gray hairline. */
  borderClassName?: string;
  /** Overrides the badge pill's background/border classes. Defaults to the standard white pill. */
  badgePillClassName?: string;
  children?: React.ReactNode;
}

export default function PageBanner({
  title,
  badge,
  subtitle,
  bgImage: _bgImage,
  isGradientText: _isGradientText,
  bgClassName = 'bg-white',
  badgeClassName = 'text-[#F9010D]',
  titleClassName = 'text-[#002147]',
  subtitleClassName = 'text-gray-600',
  borderClassName = 'border-[#002147]/10',
  badgePillClassName = 'bg-white border-[#002147]/10 shadow-sm',
  children,
}: PageBannerProps) {
  return (
    <div className={`w-full min-h-[300px] md:min-h-[400px] relative overflow-hidden border-b ${borderClassName} ${bgClassName}`}>
      {/* Dot-grid background texture — matches the Home page Hero section exactly, gently animated */}
      {/* Background fills all the way to the top, behind the fixed header; this padding clears the header for the content itself */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full pt-32 pb-12 md:pt-40 md:pb-20">
        {children ? (
          <div className="[&_h1]:text-[#002147] [&_h1]:font-bold [&_h2]:text-[#002147] [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:font-medium [&_span]:text-gray-600">
            {children}
          </div>
        ) : (
          <div className="text-center">
            {badge && (
              <div className={`inline-block px-4 py-1.5 font-bold tracking-wider uppercase rounded-full mb-4 md:mb-6 text-xs md:text-sm border backdrop-blur-md shadow-sm ${badgePillClassName}`}>
                <span className={badgeClassName}>{badge}</span>
              </div>
            )}
            {title && (
              <h1 className={`text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight max-w-4xl mx-auto mb-4 md:mb-6 tracking-tight font-serif ${titleClassName}`}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p className={`text-base md:text-xl max-w-3xl mx-auto leading-relaxed font-medium ${subtitleClassName}`}>
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
