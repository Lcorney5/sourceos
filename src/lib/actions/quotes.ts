"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { QuoteStatus } from "@/lib/supabase/database.types";
import { logActivity } from "@/lib/activity-log";

function toNullableInt(value: FormDataEntryValue | null) {
  if (!value || value === "") return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNullableString(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  return String(value).trim();
}

export async function createQuote(formData: FormData) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const supplierId = String(formData.get("supplier_id") ?? "");
  const productName = String(formData.get("product_name") ?? "").trim();
  const unitPrice = Number.parseFloat(String(formData.get("unit_price") ?? ""));

  if (!supplierId) throw new Error("Supplier is required");
  if (!productName) throw new Error("Product name is required");
  if (Number.isNaN(unitPrice)) throw new Error("Unit price is required");

  const { data, error } = await supabase
    .from("quotes")
    .insert({
      workspace_id: workspace.id,
      supplier_id: supplierId,
      product_name: productName,
      unit_price: unitPrice,
      currency: String(formData.get("currency") ?? "USD"),
      moq: toNullableInt(formData.get("moq")),
      lead_time_days: toNullableInt(formData.get("lead_time_days")),
      date_received: String(formData.get("date_received") ?? new Date().toISOString().slice(0, 10)),
      notes: toNullableString(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "logged quote",
    entityType: "quote",
    entityLabel: productName,
    entityId: data.id,
  });

  revalidatePath("/dashboard/quotes");
  redirect("/dashboard/quotes");
}

export async function updateQuote(quoteId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const productName = String(formData.get("product_name") ?? "").trim();
  const unitPrice = Number.parseFloat(String(formData.get("unit_price") ?? ""));

  if (!productName) throw new Error("Product name is required");
  if (Number.isNaN(unitPrice)) throw new Error("Unit price is required");

  const { error } = await supabase
    .from("quotes")
    .update({
      product_name: productName,
      unit_price: unitPrice,
      currency: String(formData.get("currency") ?? "USD"),
      moq: toNullableInt(formData.get("moq")),
      lead_time_days: toNullableInt(formData.get("lead_time_days")),
      date_received: String(formData.get("date_received") ?? new Date().toISOString().slice(0, 10)),
      status: String(formData.get("status") ?? "pending") as QuoteStatus,
      notes: toNullableString(formData.get("notes")),
    })
    .eq("id", quoteId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/quotes");
}

export async function setQuoteStatus(quoteId: string, status: QuoteStatus) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const { data: quote, error } = await supabase
    .from("quotes")
    .update({ status })
    .eq("id", quoteId)
    .eq("workspace_id", workspace.id)
    .select("product_name")
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: `marked quote ${status}`,
    entityType: "quote",
    entityLabel: quote?.product_name ?? null,
    entityId: quoteId,
  });

  revalidatePath("/dashboard/quotes");
}

export async function deleteQuote(quoteId: string) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const { data: quote } = await supabase
    .from("quotes")
    .select("product_name")
    .eq("id", quoteId)
    .eq("workspace_id", workspace.id)
    .single();

  const { error } = await supabase
    .from("quotes")
    .delete()
    .eq("id", quoteId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "deleted quote",
    entityType: "quote",
    entityLabel: quote?.product_name ?? null,
  });

  revalidatePath("/dashboard/quotes");
}
