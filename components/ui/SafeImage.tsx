"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

type SafeImageProps = Omit<ImageProps, "src" | "onError"> & {
  src?: string | null;
};

const PLACEHOLDER = "/images/placeholder-product.svg";

export default function SafeImage({ src, alt, ...rest }: SafeImageProps) {
  const [errored, setErrored] = useState(false);
  const resolved = errored ? PLACEHOLDER : resolveImageUrl(src);

  return (
    <Image
      {...rest}
      src={resolved}
      alt={alt || "SUN Foods"}
      onError={() => setErrored(true)}
      unoptimized={resolved.startsWith("/api/uploads/")}
    />
  );
}
