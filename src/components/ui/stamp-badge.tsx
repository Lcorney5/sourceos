import { clsx } from "clsx";

type StampTone = "ink" | "rust" | "steel" | "amber";

const TONE_CLASSES: Record<StampTone, string> = {
  ink: "text-ink border-ink",
  rust: "text-rust border-rust",
  steel: "text-steel border-steel",
  amber: "text-amber border-amber",
};

const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

export function StampBadge({
  children,
  tone = "ink",
  rotate = true,
  className,
}: {
  children: React.ReactNode;
  tone?: StampTone;
  rotate?: boolean;
  className?: string;
}) {
  const rotation = rotate
    ? ROTATIONS[String(children).length % ROTATIONS.length]
    : "";

  return (
    <span
      className={clsx(
        "stamp inline-block",
        TONE_CLASSES[tone],
        rotation,
        className
      )}
    >
      {children}
    </span>
  );
}

const QUOTE_STATUS_TONE: Record<string, StampTone> = {
  pending: "amber",
  accepted: "steel",
  rejected: "rust",
};

const SAMPLE_STATUS_TONE: Record<string, StampTone> = {
  requested: "amber",
  in_transit: "steel",
  received: "steel",
  approved: "steel",
  rejected: "rust",
};

const PO_STAGE_TONE: Record<string, StampTone> = {
  quoting: "amber",
  sampling: "amber",
  deposit_paid: "steel",
  in_production: "steel",
  shipping: "steel",
  delivered: "ink",
};

function labelize(value: string) {
  return value.replace(/_/g, " ").toUpperCase();
}

export function QuoteStatusBadge({ status }: { status: string }) {
  return (
    <StampBadge tone={QUOTE_STATUS_TONE[status] ?? "ink"}>
      {labelize(status)}
    </StampBadge>
  );
}

export function SampleStatusBadge({ status }: { status: string }) {
  return (
    <StampBadge tone={SAMPLE_STATUS_TONE[status] ?? "ink"}>
      {labelize(status)}
    </StampBadge>
  );
}

export function POStageBadge({ stage }: { stage: string }) {
  return (
    <StampBadge tone={PO_STAGE_TONE[stage] ?? "ink"}>
      {labelize(stage)}
    </StampBadge>
  );
}

export function OverdueBadge() {
  return (
    <StampBadge tone="rust" className="animate-none">
      PAST DUE
    </StampBadge>
  );
}
