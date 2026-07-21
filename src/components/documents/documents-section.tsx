import { uploadDocument } from "@/lib/actions/documents";
import { formatFileSize, type DocumentWithUrl } from "@/lib/documents";
import { DeleteDocumentButton } from "./delete-document-button";
import { Button } from "@/components/ui/button";

export function DocumentsSection({
  documents,
  supplierId = null,
  purchaseOrderId = null,
  showLinkedTo = false,
}: {
  documents: (DocumentWithUrl & {
    suppliers?: { name: string } | null;
    purchase_orders?: { product_name: string } | null;
  })[];
  supplierId?: string | null;
  purchaseOrderId?: string | null;
  showLinkedTo?: boolean;
}) {
  const action = uploadDocument.bind(null, supplierId, purchaseOrderId);

  return (
    <div>
      <form action={action} className="mb-4 flex items-end gap-3 border-b border-ink/30 pb-4">
        <input
          type="file"
          name="file"
          required
          className="flex-1 font-mono text-xs file:mr-3 file:border file:border-ink file:bg-transparent file:px-2 file:py-1 file:font-mono file:text-xs file:uppercase"
        />
        <Button type="submit" variant="secondary">
          Upload
        </Button>
      </form>
      {documents.length === 0 ? (
        <p className="font-mono text-xs text-muted">No documents yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-ink/20">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between py-2 gap-3">
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
                  {showLinkedTo && (doc.suppliers?.name || doc.purchase_orders?.product_name) && (
                    <> · {doc.suppliers?.name ?? doc.purchase_orders?.product_name}</>
                  )}
                </p>
              </div>
              <DeleteDocumentButton documentId={doc.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
