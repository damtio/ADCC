"use client";

import Image from "next/image";
import { useState } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  alt,
  sizes,
  className,
  priority = false,
  fallbackClassName = "text-4xl",
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className="flex h-full items-center justify-center"
        role="img"
        aria-label={alt}
      >
        <span className={`${fallbackClassName} font-bold text-red-600/30`}>
          BJJ
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
