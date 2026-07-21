import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StampBadge } from "@/components/ui/stamp-badge";
import { InlineActionButton } from "@/components/settings/inline-action-button";
import { UsageMeter } from "@/components/ui/usage-meter";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { inviteMember, revokeInvite, removeMember } from "@/lib/actions/workspace";
import Link from "next/link";

export default async function SettingsPage() {
  const { workspace, profile, userId } = await requireWorkspace();
  const supabase = await createClient();
  const isOwner = profile.role === "owner";

  const [{ data: members }, { data: invites }, { data: suppliers }] = await Promise.all([
    supabase.from("profiles").select("*").eq("workspace_id", workspace.id).order("created_at"),
    isOwner
      ? supabase
          .from("workspace_invites")
          .select("*")
          .eq("workspace_id", workspace.id)
          .order("created_at")
      : Promise.resolve({ data: [] }),
    supabase
      .from("suppliers")
      .select("id, name, whatsapp_connected, whatsapp_number")
      .eq("workspace_id", workspace.id)
      .order("name"),
  ]);

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Settings" />
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Members</CardTitle>
            <UsageMeter
              label="members used"
              used={(members?.length ?? 0) + (invites?.length ?? 0)}
              limit={PLAN_LIMITS[workspace.plan].members}
            />
          </CardHeader>
          <CardBody>
            <ul className="mb-4 flex flex-col divide-y divide-ink/20">
              {members?.map((member) => (
                <li key={member.id} className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm text-ink">{member.name ?? member.email}</p>
                    <p className="font-mono text-xs text-muted">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StampBadge tone={member.role === "owner" ? "amber" : "ink"}>
                      {member.role}
                    </StampBadge>
                    {isOwner && member.id !== userId && (
                      <InlineActionButton
                        label="Remove"
                        confirmMessage={`Remove ${member.email} from this workspace?`}
                        action={removeMember.bind(null, member.id)}
                      />
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {isOwner && (
              <>
                <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                  Pending Invites
                </p>
                {!invites?.length ? (
                  <p className="mb-4 font-mono text-xs text-muted">No pending invites.</p>
                ) : (
                  <ul className="mb-4 flex flex-col divide-y divide-ink/20">
                    {invites.map((invite) => (
                      <li key={invite.id} className="flex items-center justify-between py-2">
                        <span className="font-mono text-xs text-ink">{invite.email}</span>
                        <InlineActionButton
                          label="Revoke"
                          action={revokeInvite.bind(null, invite.id)}
                        />
                      </li>
                    ))}
                  </ul>
                )}
                <form action={inviteMember} className="flex items-end gap-3">
                  <Field label="Invite by Email" htmlFor="invite-email">
                    <Input id="invite-email" name="email" type="email" required placeholder="teammate@company.com" />
                  </Field>
                  <Button type="submit">Send Invite</Button>
                </form>
              </>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Connections</CardTitle>
          </CardHeader>
          <CardBody>
            {!suppliers?.length ? (
              <p className="font-mono text-xs text-muted">No suppliers yet.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-ink/20">
                {suppliers.map((supplier) => (
                  <li key={supplier.id} className="flex items-center justify-between py-2">
                    <Link
                      href={`/dashboard/suppliers/${supplier.id}`}
                      className="text-sm text-ink hover:text-rust"
                    >
                      {supplier.name}
                    </Link>
                    {supplier.whatsapp_connected ? (
                      <StampBadge tone="steel">{supplier.whatsapp_number}</StampBadge>
                    ) : (
                      <span className="font-mono text-xs text-muted">Not connected</span>
                    )}
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
