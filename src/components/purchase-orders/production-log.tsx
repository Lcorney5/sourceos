import { Field, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { addProductionLogEntry } from "@/lib/actions/production";
import type { Database } from "@/lib/supabase/database.types";

type ProductionLogEntry = Database["public"]["Tables"]["production_logs"]["Row"];

export function ProductionLog({
  purchaseOrderId,
  entries,
}: {
  purchaseOrderId: string;
  entries: ProductionLogEntry[];
}) {
  const action = addProductionLogEntry.bind(null, purchaseOrderId);

  return (
    <div>
      <form action={action} className="mb-4 flex flex-col gap-3 border-b border-ink/30 pb-4">
        <Field label="Production Update" htmlFor="note">
          <Textarea id="note" name="note" rows={2} placeholder="Week 2: molds approved" required />
        </Field>
        <Field label="Photo URLs (one per line)" htmlFor="photo_urls">
          <Textarea id="photo_urls" name="photo_urls" rows={2} />
        </Field>
        <Button type="submit" variant="secondary" className="self-start">
          Log Update
        </Button>
      </form>
      {entries.length === 0 ? (
        <p className="font-mono text-xs text-muted">No production updates logged yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id} className="border-l-2 border-steel pl-3">
              <p className="font-mono text-[0.6875rem] uppercase tracking-wide text-muted">
                {new Date(entry.created_at).toLocaleString()}
              </p>
              <p className="text-sm text-ink">{entry.note}</p>
              {entry.photo_urls.length > 0 && (
                <div className="mt-2 flex gap-2">
                  {entry.photo_urls.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={url}
                      src={url}
                      alt=""
                      className="h-16 w-16 border border-ink object-cover"
                    />
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
