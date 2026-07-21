import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { withSignedUrls, formatFileSize } from "@/lib/documents";
import { DeleteDocumentButton } from "@/components/documents/delete-document-button";
import Link from "next/link";

export default async function DocumentsPage() {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: documents } = await supabase
    .from("documents")
    .select("*, suppliers(id, name), purchase_orders(id, product_name)")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const documentsWithUrls = await withSignedUrls(supabase, documents ?? []);

  return (
    <div>
      <PageHeader eyebrow="Manifest" title="Documents" />
      {!documents?.length ? (
        <EmptyState message="No documents uploaded yet. Attach files from a supplier or purchase order page." />
      ) : (
        <ul className="flex flex-col divide-y divide-ink border border-ink">
          {documentsWithUrls.map((doc) => {
            const original = documents.find((d) => d.id === doc.id)!;
            const linkHref = original.supplier_id
              ? `/dashboard/suppliers/${original.supplier_id}`
              : original.purchase_order_id
                ? `/dashboard/purchase-orders/${original.purchase_order_id}`
                : null;
            const linkLabel = original.suppliers?.name ?? original.purchase_orders?.product_name;

            return (
              <li key={doc.id} className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block truncate text-sm text-ink hover:text-rust"
                    >
                      {doc.file_name}
                    </a>
                  ) : (
                    <span className="block truncate text-sm text-muted">{doc.file_name}</span>
                  )}
                  <p className="font-mono text-[0.6875rem] text-muted">
                    {formatFileSize(doc.file_size)}
                    {linkHref && linkLabel && (
                      <>
                        {" · "}
                        <Link href={linkHref} className="hover:text-rust">
                          {linkLabel}
                        </Link>
                      </>
                    )}
                  </p>
                </div>
                <DeleteDocumentButton documentId={doc.id} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
