import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

type Document = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentWithUrl = Document & { url: string | null };

export async function withSignedUrls(
  supabase: SupabaseClient<Database>,
  documents: Document[]
): Promise<DocumentWithUrl[]> {
  if (documents.length === 0) return [];

  const { data } = await supabase.storage
    .from("documents")
    .createSignedUrls(
      documents.map((d) => d.storage_path),
      60 * 60
    );

  const urlByPath = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));

  return documents.map((doc) => ({ ...doc, url: urlByPath.get(doc.storage_path) ?? null }));
}

export function formatFileSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
