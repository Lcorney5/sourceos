"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { logActivity } from "@/lib/activity-log";

async function requireOwner() {
  const context = await requireWorkspace();
  if (!context.isOwner) {
    throw new Error("Only the workspace owner can do this");
  }
  return context;
}

export async function inviteMember(formData: FormData) {
  const { workspace, userId, profile } = await requireOwner();
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!email) throw new Error("Email is required");

  const memberLimit = PLAN_LIMITS[workspace.plan].members;
  if (memberLimit !== null) {
    const [{ count: memberCount }, { count: inviteCount }] = await Promise.all([
      supabase
        .from("workspace_memberships")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
      supabase
        .from("workspace_invites")
        .select("id", { count: "exact", head: true })
        .eq("workspace_id", workspace.id),
    ]);
    if ((memberCount ?? 0) + (inviteCount ?? 0) >= memberLimit) {
      throw new Error(
        `Your ${workspace.plan} plan is limited to ${memberLimit} members. Upgrade to invite more.`
      );
    }
  }

  const { error } = await supabase.from("workspace_invites").insert({
    workspace_id: workspace.id,
    email,
    invited_by: userId,
  });

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "invited member",
    entityType: "member",
    entityLabel: email,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/team");
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
  const { workspace, userId, profile } = await requireOwner();
  if (profileId === userId) throw new Error("Owners cannot remove themselves");
  const supabase = await createClient();

  const { data: removed } = await supabase
    .from("profiles")
    .select("email")
    .eq("id", profileId)
    .single();

  const { error } = await supabase.rpc("remove_workspace_member", { target_user_id: profileId });

  if (error) throw new Error(error.message);

  await logActivity(supabase, {
    workspaceId: workspace.id,
    actorLabel: profile.name ?? profile.email,
    action: "removed member",
    entityType: "member",
    entityLabel: removed?.email ?? null,
  });

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/team");
}

export async function switchActiveWorkspace(workspaceId: string) {
  await requireWorkspace();
  const supabase = await createClient();

  const { error } = await supabase.rpc("switch_active_workspace", {
    target_workspace_id: workspaceId,
  });

  if (error) throw new Error(error.message);

  redirect("/dashboard/home");
}

export async function createClientWorkspace(formData: FormData) {
  const { isHomeWorkspace, workspace } = await requireWorkspace();
  if (!isHomeWorkspace) {
    throw new Error("Switch back to your home workspace before creating a client workspace");
  }
  if (workspace.plan !== "agency") {
    throw new Error("Only Agency-plan workspaces can create client workspaces");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Client workspace name is required");

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_client_workspace", { client_name: name });

  if (error) throw new Error(error.message);

  redirect("/dashboard/home");
}
