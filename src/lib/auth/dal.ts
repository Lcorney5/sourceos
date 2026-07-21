import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];

// Verifies the session and loads the caller's profile. Redirects to /login
// if unauthenticated. Memoized per-request so repeated calls across
// Server Components in a render pass don't re-hit Supabase.
export const getSessionProfile = cache(async (): Promise<{
  userId: string;
  email: string;
  profile: Profile;
}> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login");
  }

  return { userId: user.id, email: user.email ?? "", profile };
});

// Requires the caller to have completed workspace onboarding. Redirects to
// /onboarding otherwise. This is the primary guard used by dashboard pages.
export const requireWorkspace = cache(async (): Promise<{
  userId: string;
  profile: Profile;
  workspace: Workspace;
}> => {
  const { userId, profile } = await getSessionProfile();

  if (!profile.workspace_id) {
    redirect("/onboarding");
  }

  const supabase = await createClient();
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", profile.workspace_id)
    .single();

  if (error || !workspace) {
    redirect("/onboarding");
  }

  return { userId, profile, workspace };
});
