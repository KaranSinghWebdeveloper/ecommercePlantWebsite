"use client";

import Image from 'next/image';
import React, { useState } from 'react';

export function ImageWithFallback(props: React.ComponentProps<typeof Image>) {
  const [didError, setDidError] = useState(false);
  const { src, alt, className, style, sizes, ...rest } = props;
  const source = typeof src === 'string' ? src : '';
  const hasSource = source.length > 0;

  const handleError = () => {
    setDidError(true);
  };

  if (didError || !hasSource) {
    return (
      <div
        className={`relative w-full h-full bg-gray-100 text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
          <span className="text-sm">Image unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        loading="lazy"
        src={source}
        alt={alt?.toString() ?? 'Image'}
        fill
        sizes={sizes ?? '100vw'}
        className={className}
        style={style}
        onError={handleError}
        {...rest}
      />
    </div>
  );
}
