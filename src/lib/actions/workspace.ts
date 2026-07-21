"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

async function requireOwner() {
  const context = await requireWorkspace();
  if (context.profile.role !== "owner") {
    throw new Error("Only the workspace owner can do this");
  }
  return context;
}

export async function inviteMember(formData: FormData) {
  const { workspace, userId } = await requireOwner();
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("Email is required");

  const { error } = await supabase.from("workspace_invites").insert({
    workspace_id: workspace.id,
    email,
    invited_by: userId,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/settings");
}

export async function revokeInvite(inviteId: string) {
  const { workspace } = await requireOwner();
  const supabase = await createClient();

  const { error } = await supabase
    .from("workspace_invites")
    .delete()
    .eq("id", inviteId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/settings");
}

export async function removeMember(profileId: string) {
  const { workspace, userId } = await requireOwner();
  if (profileId === userId) throw new Error("Owners cannot remove themselves");
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({ workspace_id: null, role: "member" })
    .eq("id", profileId)
    .eq("workspace_id", workspace.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/settings");
}
