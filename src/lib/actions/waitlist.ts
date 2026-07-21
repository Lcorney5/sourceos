"use server";

import { createClient } from "@/lib/supabase/server";

export type WaitlistState = { status: "idle" | "success" | "error"; message?: string };

export async function joinWaitlist(
  _prevState: WaitlistState,
  formData: FormData
): Promise<WaitlistState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("waitlist_signups").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { status: "success", message: "You're already on the list." };
    }
    return { status: "error", message: "Something went wrong. Try again." };
  }

  return { status: "success", message: "You're on the list." };
}
