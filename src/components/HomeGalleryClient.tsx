'use client';

import React from 'react';

export default function HomeGalleryClient({ images }: { images: string[] }) {
  if (!images || images.length === 0) return null;

  // Ensure we have enough images for a dense loop (at least 6-8)
  let displayImages = [...images];
  while (displayImages.length < 8) {
    displayImages = [...displayImages, ...images];
  }
  // Cap at 12 to avoid too many DOM nodes if the array was large
  displayImages = displayImages.slice(0, 12);

  const numImages = displayImages.length;
  const totalDuration = 24; // 24 seconds for a full cycle
  const delayPerImage = totalDuration / numImages;

  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-transparent flex items-center justify-center overflow-hidden">
      
      <style>{`
        @keyframes swingAndSlide {
          0% {
            transform: perspective(1200px) translate3d(300px, 0, -400px) rotateY(-65deg);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          20% { /* Arrive at the front */
            transform: perspective(1200px) translate3d(0, 0, 0) rotateY(0deg);
            opacity: 1;
          }
          95% { /* Slide smoothly to the left */
            transform: perspective(1200px) translate3d(-1500px, 0, 0) rotateY(0deg);
            opacity: 1;
          }
          100% {
            transform: perspective(1200px) translate3d(-1600px, 0, 0) rotateY(0deg);
            opacity: 0;
          }
        }
        
        .gallery-card {
          animation: swingAndSlide ${totalDuration}s linear infinite;
        }
      `}</style>

      {/* Container for the cards */}
      <div className="relative w-[280px] h-[180px] md:w-[360px] md:h-[240px]">
        {displayImages.map((img, i) => {
          // Negative delay ensures all cards are pre-distributed along the animation path instantly
          const delay = -(numImages - i) * delayPerImage;
          
          return (
            <div
              key={i}
              className="gallery-card absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[4px] border-white cursor-pointer group"
              style={{
                animationDelay: `${delay}s`
              }}
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img 
                src={img} 
                alt={`Gallery image ${i}`}
                width={360}
                height={240}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
          );
        })}
      </div>
      
      {/* Optional fade mask on the left side to hide cards smoothly as they exit */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-white to-transparent pointer-events-none z-20"></div>

    </div>
  );
}
