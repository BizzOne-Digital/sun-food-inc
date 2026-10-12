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
        src="/images/sunn-foods-transparent.png"
        alt="SUNN Foods"
        width={1254}
        height={1254}
        className="h-12 w-auto object-contain"
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
