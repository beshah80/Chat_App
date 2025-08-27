'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

type FallbackImageProps = Omit<ImageProps, 'src'> & { src?: string };

export function ImageWithFallback(props: FallbackImageProps) {
  const { src, alt = '', ...rest } = props;
  const [didError, setDidError] = useState(false);

  const handleError = () => {
    setDidError(true);
  };

  return didError || !src ? (
    <div className="inline-block bg-muted flex items-center justify-center">
      <Image
        src={ERROR_IMG_SRC}
        alt="Error loading image"
        width={88}
        height={88}
        {...rest}
      />
    </div>
  ) : (
    <Image
      src={src}
      alt={alt}
      {...rest}
      onError={handleError}
      sizes="(max-width: 768px) 100vw, 50vw"
      style={{ objectFit: 'contain', ...props.style }}
    />
  );
}
