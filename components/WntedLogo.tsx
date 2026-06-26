export default function WntedLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="6"
        stroke="white"
        strokeWidth="1.2"
        opacity="0.35"
      />
      <path
        d="M8 22 L12 10 L16 18 L20 10 L24 22"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="16" cy="8" r="2" fill="white" opacity="0.9" />
    </svg>
  );
}
