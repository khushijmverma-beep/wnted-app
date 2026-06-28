import Image from 'next/image';

export default function WntedLogo({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/Logo4.png"
      alt="Wnted"
      width={size}
      height={size}
      className="shrink-0 object-contain"
      style={{
        width: size,
        height: size,
      }}
      priority
    />
  );
}
