import Link from "next/link";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ showTagline = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="32" cy="26" r="12" fill="#E99719" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <rect
            key={deg}
            x="31"
            y="4"
            width="2"
            height="6"
            fill="#D95A1A"
            transform={`rotate(${deg} 32 26)`}
          />
        ))}
        <path
          d="M6 54C12 40 22 34 32 34C42 34 52 40 58 54"
          stroke="#496F2E"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M14 54C18 46 25 42 32 42C39 42 46 46 50 54"
          stroke="#29491F"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-xl text-brown font-bold">SUNN Foods</span>
        {showTagline && (
          <span className="text-xs text-leaf font-medium">Good Food. Brighter Days.</span>
        )}
      </span>
    </Link>
  );
}
