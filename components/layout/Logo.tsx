import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <Image
        src="/images/sunn-foods-transparent.png"
        alt="SUNN Foods"
        width={1254}
        height={1254}
        className="h-16 w-auto object-contain"
      />
    </Link>
  );
}
