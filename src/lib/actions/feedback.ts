"use server";

import { revalidatePath } from "next/cache";
import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import type { FeedbackType } from "@/lib/supabase/database.types";

const VALID_TYPES: FeedbackType[] = ["feedback", "bug", "feature"];

export async function submitFeedback(formData: FormData) {
  const { workspace, userId } = await requireWorkspace();
  const supabase = await createClient();

  const type = String(formData.get("type") ?? "");
  if (!VALID_TYPES.includes(type as FeedbackType)) throw new Error("Invalid submission type");

  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  if (!subject) throw new Error("Subject is required");
  if (!description) throw new Error("Description is required");

  const { error } = await supabase.from("feedback_submissions").insert({
    workspace_id: workspace.id,
    submitted_by: userId,
    type: type as FeedbackType,
    subject,
    description,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/feedback");
}
