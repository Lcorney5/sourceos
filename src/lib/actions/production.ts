"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";

function parsePhotoUrls(value: FormDataEntryValue | null) {
  if (!value) return [];
  return String(value)
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export async function addProductionLogEntry(purchaseOrderId: string, formData: FormData) {
  const { userId, workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const note = String(formData.get("note") ?? "").trim();
  if (!note) throw new Error("Note is required");

  const { data: po } = await supabase
    .from("purchase_orders")
    .select("product_name")
    .eq("id", purchaseOrderId)
    .eq("workspace_id", workspace.id)
    .single();

  const { error } = await supabase.from("production_logs").insert({
    workspace_id: workspace.id,
    purchase_order_id: purchaseOrderId,
    note,
    photo_urls: parsePhotoUrls(formData.get("photo_urls")),
    created_by: userId,
  });

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "logged production update",
    entityType: "purchase_order",
    entityLabel: po?.product_name ?? null,
    entityId: purchaseOrderId,
  });

  revalidatePath(`/dashboard/purchase-orders/${purchaseOrderId}`);
  revalidatePath("/dashboard/production");
}

export async function deleteProductionLogEntry(logId: string) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: log } = await supabase
    .from("production_logs")
    .select("purchase_order_id")
    .eq("id", logId)
    .eq("workspace_id", workspace.id)
    .single();
  if (!log) throw new Error("Entry not found");

  const { error } = await supabase
    .from("production_logs")
    .delete()
    .eq("id", logId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/purchase-orders/${log.purchase_order_id}`);
  revalidatePath("/dashboard/production");
}
