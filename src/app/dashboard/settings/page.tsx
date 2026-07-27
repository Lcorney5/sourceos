import { PageHeader, Card, CardHeader, CardTitle, CardBody } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Settings" />
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardBody>
          <p className="font-mono text-xs text-muted">Nothing to configure here yet.</p>
        </CardBody>
      </Card>
    </div>
  );
}
