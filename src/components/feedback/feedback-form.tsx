"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MessagesIcon } from "@/components/dashboard/nav-icons";
import { BugIcon, LightbulbIcon, SendIcon } from "@/components/ui/icons";
import { submitFeedback } from "@/lib/actions/feedback";
import type { FeedbackType } from "@/lib/supabase/database.types";

const TYPES: { value: FeedbackType; label: string; icon: React.ReactNode }[] = [
  { value: "feedback", label: "Feedback", icon: <MessagesIcon size={14} /> },
  { value: "bug", label: "Bug Report", icon: <BugIcon size={14} /> },
  { value: "feature", label: "Feature Request", icon: <LightbulbIcon size={14} /> },
];

export function FeedbackForm() {
  const [type, setType] = useState<FeedbackType>("feedback");

  return (
    <form action={submitFeedback} className="flex flex-col gap-4">
      <input type="hidden" name="type" value={type} />

      <div>
        <p className="mb-1 font-mono text-[0.6875rem] font-semibold uppercase tracking-wider text-muted">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={clsx(
                "flex items-center gap-2 border px-3 py-2 font-mono text-xs font-semibold uppercase tracking-wider",
                type === t.value
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/30 text-muted hover:border-ink hover:text-ink"
              )}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Field label="Subject" htmlFor="feedback-subject">
        <Input id="feedback-subject" name="subject" required placeholder="Brief summary..." />
      </Field>

      <Field label="Description" htmlFor="feedback-description">
        <Textarea
          id="feedback-description"
          name="description"
          required
          rows={5}
          placeholder="Describe your feedback, bug, or feature request in detail..."
        />
      </Field>

      <Button type="submit" className="w-full">
        <SendIcon size={14} />
        Submit
      </Button>
    </form>
  );
}
