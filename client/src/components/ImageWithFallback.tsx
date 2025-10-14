import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  width = 400,
  height = 300
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset state when src changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const defaultFallback = `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle" dy=".3em">
        Chargement...
      </text>
    </svg>
  `)}`;

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc(defaultFallback);
      }
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default ImageWithFallback;
