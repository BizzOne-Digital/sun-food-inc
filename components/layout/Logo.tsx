import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ showTagline = false, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2 group ${className}`}>
      <Image
        src="/images/logo.png"
        alt="SUNN Foods"
        width={150}
        height={100}
        className="h-10 w-auto object-contain"
      />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-xl text-brown font-bold">SUNN Foods</span>
        {showTagline && (
          <span className="text-xs text-leaf font-medium">Good Food. Brighter Days.</span>
        )}
      </span>
    </Link>
  );
}
