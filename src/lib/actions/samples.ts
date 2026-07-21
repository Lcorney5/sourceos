"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { SampleStatus } from "@/lib/supabase/database.types";
import { logActivity } from "@/lib/activity-log";

function toNullableString(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  return String(value).trim();
}

function parsePhotoUrls(value: FormDataEntryValue | null) {
  if (!value) return [];
  return String(value)
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);
}

export async function createSample(formData: FormData) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const supplierId = String(formData.get("supplier_id") ?? "");
  const productName = String(formData.get("product_name") ?? "").trim();

  if (!supplierId) throw new Error("Supplier is required");
  if (!productName) throw new Error("Product name is required");

  const { data, error } = await supabase
    .from("samples")
    .insert({
      workspace_id: workspace.id,
      supplier_id: supplierId,
      product_name: productName,
      revision: Number.parseInt(String(formData.get("revision") ?? "1"), 10) || 1,
      notes: toNullableString(formData.get("notes")),
      photo_urls: parsePhotoUrls(formData.get("photo_urls")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "requested sample",
    entityType: "sample",
    entityLabel: productName,
    entityId: data.id,
  });

  revalidatePath("/dashboard/samples");
  redirect(`/dashboard/samples/${data.id}`);
}

export async function updateSample(sampleId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const productName = String(formData.get("product_name") ?? "").trim();
  if (!productName) throw new Error("Product name is required");

  const { error } = await supabase
    .from("samples")
    .update({
      product_name: productName,
      revision: Number.parseInt(String(formData.get("revision") ?? "1"), 10) || 1,
      status: String(formData.get("status") ?? "requested") as SampleStatus,
      notes: toNullableString(formData.get("notes")),
      photo_urls: parsePhotoUrls(formData.get("photo_urls")),
      date_updated: new Date().toISOString(),
    })
    .eq("id", sampleId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/samples");
  revalidatePath(`/dashboard/samples/${sampleId}`);
}

export async function setSampleStatus(sampleId: string, status: SampleStatus) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const { data: sample, error } = await supabase
    .from("samples")
    .update({ status, date_updated: new Date().toISOString() })
    .eq("id", sampleId)
    .eq("workspace_id", workspace.id)
    .select("product_name")
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: `marked sample ${status}`,
    entityType: "sample",
    entityLabel: sample?.product_name ?? null,
    entityId: sampleId,
  });

  revalidatePath("/dashboard/samples");
}

export async function requestNextRevision(sampleId: string) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { data: sample, error: fetchError } = await supabase
    .from("samples")
    .select("revision")
    .eq("id", sampleId)
    .eq("workspace_id", workspace.id)
    .single();

  if (fetchError || !sample) throw new Error(fetchError?.message ?? "Sample not found");

  const { error } = await supabase
    .from("samples")
    .update({
      revision: sample.revision + 1,
      status: "requested",
      date_updated: new Date().toISOString(),
    })
    .eq("id", sampleId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/samples");
  revalidatePath(`/dashboard/samples/${sampleId}`);
}

export async function deleteSample(sampleId: string) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const { data: sample } = await supabase
    .from("samples")
    .select("product_name")
    .eq("id", sampleId)
    .eq("workspace_id", workspace.id)
    .single();

  const { error } = await supabase
    .from("samples")
    .delete()
    .eq("id", sampleId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "deleted sample",
    entityType: "sample",
    entityLabel: sample?.product_name ?? null,
  });

  revalidatePath("/dashboard/samples");
  redirect("/dashboard/samples");
}
