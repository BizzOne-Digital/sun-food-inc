"use client";

import { useRef, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { useToast } from "@/components/ui/ToastProvider";
import type { UploadFolder } from "@/models/StoredUpload";

interface LocalImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  folder: UploadFolder;
  label: string;
  required?: boolean;
  disabled?: boolean;
}

export default function LocalImageField({
  value,
  onChange,
  folder,
  label,
  required = false,
  disabled = false,
}: LocalImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }
      onChange(data.url);
      showToast("Image uploaded", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-brown">
        {label} {required && <span className="text-orange">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-beige bg-soft-bg flex-shrink-0">
          <SafeImage src={value} alt={label} fill className="object-cover" sizes="80px" />
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={disabled || uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="text-xs"
          />
          <div className="flex gap-2">
            {uploading && <span className="text-xs text-leaf">Uploading...</span>}
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs text-orange underline"
                disabled={disabled}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
