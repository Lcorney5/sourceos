"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { normalizePhoneNumber } from "@/lib/phone";

function toNullableInt(value: FormDataEntryValue | null) {
  if (!value || value === "") return null;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNullableString(value: FormDataEntryValue | null) {
  if (!value || String(value).trim() === "") return null;
  return String(value).trim();
}

export async function createSupplier(formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Supplier name is required");

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      workspace_id: workspace.id,
      name,
      location: toNullableString(formData.get("location")),
      moq: toNullableInt(formData.get("moq")),
      lead_time_days: toNullableInt(formData.get("lead_time_days")),
      contact_email: toNullableString(formData.get("contact_email")),
      contact_phone: toNullableString(formData.get("contact_phone")),
      notes: toNullableString(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/suppliers");
  redirect(`/dashboard/suppliers/${data.id}`);
}

export async function updateSupplier(supplierId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Supplier name is required");

  const { error } = await supabase
    .from("suppliers")
    .update({
      name,
      location: toNullableString(formData.get("location")),
      moq: toNullableInt(formData.get("moq")),
      lead_time_days: toNullableInt(formData.get("lead_time_days")),
      contact_email: toNullableString(formData.get("contact_email")),
      contact_phone: toNullableString(formData.get("contact_phone")),
      notes: toNullableString(formData.get("notes")),
    })
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/suppliers");
  revalidatePath(`/dashboard/suppliers/${supplierId}`);
}

export async function deleteSupplier(supplierId: string) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { error } = await supabase
    .from("suppliers")
    .delete()
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/suppliers");
  redirect("/dashboard/suppliers");
}

export async function addCommunicationLogEntry(supplierId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const summary = String(formData.get("summary") ?? "").trim();
  if (!summary) throw new Error("Summary is required");
  const source = String(formData.get("source") ?? "manual").trim() || "manual";

  const { data: supplier, error: fetchError } = await supabase
    .from("suppliers")
    .select("communication_log")
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id)
    .single();

  if (fetchError || !supplier) throw new Error(fetchError?.message ?? "Supplier not found");

  const updatedLog = [
    ...supplier.communication_log,
    { date: new Date().toISOString(), source, summary },
  ];

  const { error } = await supabase
    .from("suppliers")
    .update({ communication_log: updatedLog })
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/suppliers/${supplierId}`);
}

export async function setWhatsappConnection(
  supplierId: string,
  whatsappNumber: string,
  connected: boolean
) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const { error } = await supabase
    .from("suppliers")
    .update({
      whatsapp_number: connected ? normalizePhoneNumber(whatsappNumber) : null,
      whatsapp_connected: connected,
    })
    .eq("id", supplierId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/suppliers/${supplierId}`);
  revalidatePath("/dashboard/settings");
}
