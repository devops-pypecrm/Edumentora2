'use client';

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export default function GalleryImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-300 ${className}`}>
        <ImageOff className="w-8 h-8" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
