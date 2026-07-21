"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";

export async function uploadDocument(
  supplierId: string | null,
  purchaseOrderId: string | null,
  formData: FormData
) {
  const { userId, workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Choose a file to upload");
  }

  const ext = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const storagePath = `${workspace.id}/${crypto.randomUUID()}${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(storagePath, file, { contentType: file.type || undefined });
  if (uploadError) throw new Error(uploadError.message);

  const { error } = await supabase.from("documents").insert({
    workspace_id: workspace.id,
    supplier_id: supplierId,
    purchase_order_id: purchaseOrderId,
    file_name: file.name,
    storage_path: storagePath,
    file_size: file.size,
    content_type: file.type || null,
    uploaded_by: userId,
  });
  if (error) {
    await supabase.storage.from("documents").remove([storagePath]);
    throw new Error(error.message);
  }

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "uploaded document",
    entityType: "document",
    entityLabel: file.name,
  });

  if (supplierId) revalidatePath(`/dashboard/suppliers/${supplierId}`);
  if (purchaseOrderId) revalidatePath(`/dashboard/purchase-orders/${purchaseOrderId}`);
  revalidatePath("/dashboard/documents");
}

export async function deleteDocument(documentId: string) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path, supplier_id, purchase_order_id")
    .eq("id", documentId)
    .eq("workspace_id", workspace.id)
    .single();
  if (!doc) throw new Error("Document not found");

  await supabase.storage.from("documents").remove([doc.storage_path]);

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("workspace_id", workspace.id);
  if (error) throw new Error(error.message);

  if (doc.supplier_id) revalidatePath(`/dashboard/suppliers/${doc.supplier_id}`);
  if (doc.purchase_order_id) revalidatePath(`/dashboard/purchase-orders/${doc.purchase_order_id}`);
  revalidatePath("/dashboard/documents");
}
