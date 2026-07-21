import { IconBase } from "@/components/dashboard/stat-icons";

export function HomeIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
      <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
      <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
      <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
    </IconBase>
  );
}

export function DashboardIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 17.5h15" />
      <path d="M4.5 17V10M9.5 17V3M14.5 17v-8" />
    </IconBase>
  );
}

export function DirectoryIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
      <circle cx="7.3" cy="9" r="1.6" />
      <path d="M4.8 13.2c.5-1.3 1.5-1.9 2.5-1.9s2 .6 2.5 1.9" />
      <path d="M12.5 7.7h3M12.5 10.3h3" />
    </IconBase>
  );
}

export function PerformanceIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 15 7.5 9l3 3 6.5-7" />
      <path d="M13.5 4.5H17V8" />
    </IconBase>
  );
}

export function SamplesIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M10 2.5 17 6.5v7L10 17.5 3 13.5v-7L10 2.5Z" />
      <path d="M3 6.5 10 10.5 17 6.5M10 10.5V17.5" />
    </IconBase>
  );
}

export function ProductsIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <circle cx="7" cy="7.5" r="3" />
      <circle cx="13" cy="7.5" r="3" />
      <circle cx="10" cy="13" r="3" />
    </IconBase>
  );
}

export function OrdersIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8h6.8a1 1 0 0 0 1-.8L17 7H5.5" />
      <circle cx="8" cy="16.3" r="1.2" />
      <circle cx="14" cy="16.3" r="1.2" />
    </IconBase>
  );
}

export function FinanceIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M10 3v14" />
      <path d="M13 6.5c0-1.4-1.3-2.5-3-2.5S7 5.1 7 6.5c0 3 6 1.3 6 4.5 0 1.4-1.3 2.5-3 2.5s-3-1.1-3-2.5" />
    </IconBase>
  );
}

export function ActivityLogIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 10.5h3l2-5.5 3 10 2-6.5h4.5" />
    </IconBase>
  );
}

export function TimelineIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <circle cx="5" cy="4.5" r="1.6" />
      <circle cx="5" cy="15.5" r="1.6" />
      <circle cx="15" cy="10" r="1.6" />
      <path d="M5 6.1v7.8" />
      <path d="M6.4 5.2 13.6 9" />
    </IconBase>
  );
}

export function CalendarIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="2.5" y="4" width="15" height="13.5" rx="1" />
      <path d="M2.5 8h15" />
      <path d="M6.5 2v4M13.5 2v4" />
    </IconBase>
  );
}

export function ProductionIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 13.5V6a1 1 0 0 1 1-1h6.5v8.5H2.5Z" />
      <path d="M10 8.5h3.5L16 11v2.5h-6V8.5Z" />
      <circle cx="6" cy="14.5" r="1.4" />
      <circle cx="13.5" cy="14.5" r="1.4" />
    </IconBase>
  );
}

export function DocumentsIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 5.5a1 1 0 0 1 1-1h4l1.5 2h7.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-9Z" />
    </IconBase>
  );
}

export function MessagesIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 4.5h15v9H8l-3 3v-3H2.5Z" />
    </IconBase>
  );
}

export function TeamIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <circle cx="7" cy="7" r="2.3" />
      <circle cx="14" cy="8" r="2" />
      <path d="M3 16c.6-2.8 2.3-4.2 4-4.2s3.4 1.4 4 4.2" />
      <path d="M11.3 16c.4-2 1.5-3.4 2.7-3.4s2.3 1.4 2.7 3.4" />
    </IconBase>
  );
}
