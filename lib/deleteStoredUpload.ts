import connectToDatabase from "./mongodb";
import StoredUpload from "@/models/StoredUpload";

const ALLOWED_FOLDERS = ["products", "gallery", "pages", "misc"];

export async function deleteStoredUploadByUrl(url?: string | null): Promise<void> {
  if (!url || !url.startsWith("/api/uploads/")) return;
  const parts = url.replace("/api/uploads/", "").split("/");
  if (parts.length !== 2) return;
  const [folder, filename] = parts;
  if (!ALLOWED_FOLDERS.includes(folder)) return;
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return;
  }
  try {
    await connectToDatabase();
    await StoredUpload.deleteOne({ folder, filename });
  } catch {
    // best-effort cleanup; ignore failures
  }
}
