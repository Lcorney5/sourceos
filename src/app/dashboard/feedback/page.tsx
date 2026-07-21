import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/table";
import { FeedbackTypeBadge } from "@/components/ui/stamp-badge";
import { FeedbackForm } from "@/components/feedback/feedback-form";

export default async function FeedbackPage() {
  const { userId } = await requireWorkspace();
  const supabase = await createClient();

  const { data: submissions } = await supabase
    .from("feedback_submissions")
    .select("*")
    .eq("submitted_by", userId)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Feedback & Support"
        subtitle="Submit feedback, report bugs, or request features"
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>New Submission</CardTitle>
          </CardHeader>
          <CardBody>
            <FeedbackForm />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Submissions</CardTitle>
          </CardHeader>
          <CardBody>
            {!submissions?.length ? (
              <EmptyState message="No submissions yet." />
            ) : (
              <ul className="flex flex-col divide-y divide-ink/20">
                {submissions.map((s) => (
                  <li key={s.id} className="py-3 first:pt-0">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="font-semibold text-ink">{s.subject}</p>
                      <FeedbackTypeBadge type={s.type} />
                    </div>
                    <p className="line-clamp-2 text-sm text-muted">{s.description}</p>
                    <p className="mt-1 font-mono text-xs text-muted">
                      {new Date(s.created_at).toLocaleDateString()}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
