import { IconBase } from "@/components/dashboard/stat-icons";

export function SearchIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M16.5 16.5 13 13" />
    </IconBase>
  );
}

export function PinIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M10 17.5S15.5 12.4 15.5 8a5.5 5.5 0 1 0-11 0c0 4.4 5.5 9.5 5.5 9.5Z" />
      <circle cx="10" cy="8" r="2" />
    </IconBase>
  );
}

export function MailIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="2.5" y="4.5" width="15" height="11" rx="1" />
      <path d="M2.5 5.5 10 11 17.5 5.5" />
    </IconBase>
  );
}

export function ExternalLinkIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M8.5 4h-4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-4" />
      <path d="M11 3.5h5.5V9M16.2 3.8l-6.7 6.7" />
    </IconBase>
  );
}

export function CrownIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M3 8.5 6 11l4-5.5L14 11l3-2.5-1.3 6.5H4.3L3 8.5Z" />
      <path d="M4.3 15h11.4" />
    </IconBase>
  );
}

export function BugIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <rect x="6.5" y="6.5" width="7" height="9" rx="3.5" />
      <path d="M10 6.5V4.5M7.5 5 6 3.5M12.5 5 14 3.5" />
      <path d="M6.5 9h-3M6.5 12.5h-3M13.5 9h3M13.5 12.5h3" />
    </IconBase>
  );
}

export function LightbulbIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M7 15h6M7.8 17h4.4" />
      <path d="M10 2.5a5 5 0 0 0-2.8 9.1c.5.4.8 1 .8 1.6v.3h4v-.3c0-.6.3-1.2.8-1.6A5 5 0 0 0 10 2.5Z" />
    </IconBase>
  );
}

export function SendIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M17 3 2.5 9l6 2.5L11 17.5 17 3Z" />
      <path d="M8.5 11.5 17 3" />
    </IconBase>
  );
}
