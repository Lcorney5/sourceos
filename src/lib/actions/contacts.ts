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

export async function createContact(formData: FormData) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const { data, error } = await supabase
    .from("contacts")
    .insert({
      workspace_id: workspace.id,
      name,
      company: toNullableString(formData.get("company")),
      role: toNullableString(formData.get("role")),
      email: toNullableString(formData.get("email")),
      phone: toNullableString(formData.get("phone")),
      notes: toNullableString(formData.get("notes")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "added contact",
    entityType: "contact",
    entityLabel: name,
    entityId: data.id,
  });

  revalidatePath("/dashboard/directory");
  redirect("/dashboard/directory");
}

export async function updateContact(contactId: string, formData: FormData) {
  const { workspace } = await requireWorkspace();
  const supabase = await createClient();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required");

  const { error } = await supabase
    .from("contacts")
    .update({
      name,
      company: toNullableString(formData.get("company")),
      role: toNullableString(formData.get("role")),
      email: toNullableString(formData.get("email")),
      phone: toNullableString(formData.get("phone")),
      notes: toNullableString(formData.get("notes")),
    })
    .eq("id", contactId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/directory");
  revalidatePath(`/dashboard/directory/${contactId}`);
}

export async function deleteContact(contactId: string) {
  const { workspace, profile } = await requireWorkspace();
  const supabase = await createClient();

  const { data: contact } = await supabase
    .from("contacts")
    .select("name")
    .eq("id", contactId)
    .eq("workspace_id", workspace.id)
    .single();

  const { error } = await supabase
    .from("contacts")
    .delete()
    .eq("id", contactId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "deleted contact",
    entityType: "contact",
    entityLabel: contact?.name ?? null,
  });

  revalidatePath("/dashboard/directory");
  redirect("/dashboard/directory");
}
