import { redirect } from "next/navigation";
import { getSessionProfile } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { AuthCard } from "@/components/auth/auth-card";

export default async function OnboardingPage() {
  const { profile } = await getSessionProfile();

  if (profile.workspace_id) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: invite } = await supabase
    .from("workspace_invites")
    .select("id, workspace_id")
    .eq("email", profile.email)
    .maybeSingle();

  if (invite) {
    await supabase.rpc("accept_workspace_invite", { invite_email: profile.email });
    redirect("/dashboard");
  }

  return (
    <AuthCard title="Name Your Workspace" subtitle="One-Time Setup" footer={null}>
      <CreateWorkspaceForm />
    </AuthCard>
  );
}
