"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import LocalImageField from "@/components/admin/LocalImageField";
import { useToast } from "@/components/ui/ToastProvider";

interface UploadItem {
  _id: string;
  folder: string;
  filename: string;
  url: string;
  size: number;
}

const FOLDERS = ["all", "products", "gallery", "pages", "misc"];

export default function AdminGalleryPage() {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [folder, setFolder] = useState("all");
  const [uploadFolder, setUploadFolder] = useState("gallery");
  const [uploadValue, setUploadValue] = useState("");
  const { showToast } = useToast();

  async function load() {
    const res = await fetch(`/api/admin/gallery?folder=${folder}`);
    const data = await res.json();
    setUploads(data.uploads || []);
  }

  useEffect(() => {
    load();
  }, [folder]);

  async function remove(id: string) {
    if (!confirm("Delete this file? This cannot be undone.")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    showToast("File deleted", "success");
    load();
  }

  function copyUrl(url: string) {
    navigator.clipboard?.writeText(window.location.origin + url);
    showToast("URL copied", "success");
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown mb-8">Gallery</h1>

      <div className="bg-soft-bg rounded-2xl p-6 mb-8 max-w-md">
        <h2 className="font-semibold text-brown mb-3">Upload New File</h2>
        <select value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)} className="border border-beige rounded-lg px-3 py-2 mb-3 w-full">
          <option value="gallery">Gallery</option>
          <option value="products">Products</option>
          <option value="pages">Pages</option>
          <option value="misc">Misc</option>
        </select>
        <LocalImageField
          label="File"
          folder={uploadFolder as "products" | "gallery" | "pages" | "misc"}
          value={uploadValue}
          onChange={(url) => {
            setUploadValue(url);
            if (url) load();
          }}
        />
      </div>

      <div className="flex gap-2 mb-6">
        {FOLDERS.map((f) => (
          <button
            key={f}
            onClick={() => setFolder(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold ${folder === f ? "bg-orange text-white" : "bg-white border border-beige"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {uploads.map((u) => (
          <div key={u._id} className="bg-white border border-beige rounded-xl p-3">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-soft-bg mb-2">
              <SafeImage src={u.url} alt={u.filename} fill className="object-cover" sizes="200px" />
            </div>
            <p className="text-xs text-brown/60 truncate mb-2">{u.filename}</p>
            <div className="flex justify-between text-xs">
              <button onClick={() => copyUrl(u.url)} className="text-orange font-semibold">Copy URL</button>
              <button onClick={() => remove(u._id)} className="text-orange font-semibold">Delete</button>
            </div>
          </div>
        ))}
        {uploads.length === 0 && <p className="text-brown/60 col-span-full">No files in this folder.</p>}
      </div>
    </div>
  );
}
