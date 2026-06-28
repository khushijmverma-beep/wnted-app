'use client';

import Image from 'next/image';

type ItemPreviewBackdropProps = {
  image?: string | null;
  sizes?: string;
};

export default function ItemPreviewBackdrop({
  image,
  sizes = '120px',
}: ItemPreviewBackdropProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          className="scale-110 object-cover blur-xl"
          sizes={sizes}
        />
      )}
      <div
        className="absolute inset-0"
        style={{
          background: image ? 'rgba(0,0,0,0.1)' : 'rgba(250,247,239,0.05)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      />
    </div>
  );
}
