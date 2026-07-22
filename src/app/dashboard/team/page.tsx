import { requireWorkspace } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { StampBadge } from "@/components/ui/stamp-badge";
import { CrownIcon } from "@/components/ui/icons";
import { InlineActionButton } from "@/components/settings/inline-action-button";
import { CopyWorkspaceId } from "@/components/team/copy-workspace-id";
import { UsageMeter } from "@/components/ui/usage-meter";
import { PLAN_LIMITS } from "@/lib/plan-limits";
import { inviteMember, revokeInvite, removeMember } from "@/lib/actions/workspace";

export default async function TeamPage() {
  const { workspace, userId, isOwner } = await requireWorkspace();
  const supabase = await createClient();

  const [{ data: memberships }, { data: invites }] = await Promise.all([
    supabase
      .from("workspace_memberships")
      .select("role, profiles(id, name, email)")
      .eq("workspace_id", workspace.id)
      .order("created_at"),
    isOwner
      ? supabase
          .from("workspace_invites")
          .select("*")
          .eq("workspace_id", workspace.id)
          .order("created_at")
      : Promise.resolve({ data: [] }),
  ]);

  const members = (memberships ?? []).flatMap((m) => (m.profiles ? [{ ...m.profiles, role: m.role }] : []));
  const memberCount = members.length;

  return (
    <div>
      <PageHeader
        title="Team Management"
        subtitle={`${memberCount} member${memberCount === 1 ? "" : "s"} in ${workspace.plan}`}
      />

      <div className="mb-6">
        <CopyWorkspaceId workspaceId={workspace.id} />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Members</CardTitle>
          <UsageMeter
            label="members used"
            used={memberCount + (invites?.length ?? 0)}
            limit={PLAN_LIMITS[workspace.plan].members}
          />
        </CardHeader>
        <CardBody>
          <ul className="mb-6 flex flex-col divide-y divide-ink/20 border border-ink">
            {members.map((member) => (
              <li key={member.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  {member.role === "owner" && <CrownIcon size={16} />}
                  <div>
                    <p className="text-sm text-ink">{member.name ?? member.email}</p>
                    <p className="font-mono text-xs text-muted">{member.email}</p>
                  </div>
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
              <p className="mb-2 font-display text-lg font-bold uppercase tracking-tight">
                Invite Member
              </p>
              <form action={inviteMember} className="mb-6 flex items-end gap-3">
                <Field label="Email Address" htmlFor="invite-email">
                  <Input id="invite-email" name="email" type="email" required placeholder="teammate@company.com" />
                </Field>
                <Field label="Role" htmlFor="invite-role">
                  <Select id="invite-role" name="role" defaultValue="member">
                    <option value="member">Member</option>
                  </Select>
                </Field>
                <Button type="submit">+ Invite</Button>
              </form>

              <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">
                Pending Invites
              </p>
              {!invites?.length ? (
                <p className="font-mono text-xs text-muted">No pending invites.</p>
              ) : (
                <ul className="flex flex-col divide-y divide-ink/20">
                  {invites.map((invite) => (
                    <li key={invite.id} className="flex items-center justify-between py-2">
                      <span className="font-mono text-xs text-ink">{invite.email}</span>
                      <InlineActionButton label="Revoke" action={revokeInvite.bind(null, invite.id)} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
