"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity-log";

function toNullableString(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  return String(value).trim();
}

export async function createProduct(formData: FormData) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Product name is required");

  const { data, error } = await supabase
    .from("products")
    .insert({
      workspace_id: workspace.id,
      name,
      sku: toNullableString(formData.get("sku")),
      category: toNullableString(formData.get("category")),
      notes: toNullableString(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "added product",
    entityType: "product",
    entityLabel: name,
    entityId: data.id,
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function updateProduct(productId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Product name is required");

  const { error } = await supabase
    .from("products")
    .update({
      name,
      sku: toNullableString(formData.get("sku")),
      category: toNullableString(formData.get("category")),
      notes: toNullableString(formData.get("notes")),
    })
    .eq("id", productId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/products");
  revalidatePath(`/dashboard/products/${productId}`);
}

export async function deleteProduct(productId: string) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name")
    .eq("id", productId)
    .eq("workspace_id", workspace.id)
    .single();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "deleted product",
    entityType: "product",
    entityLabel: product?.name ?? null,
  });

  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}
