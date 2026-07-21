export function IconBase({
  children,
  size = 18,
}: {
  children: React.ReactNode;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function SuppliersIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M2.5 16V5.5a1 1 0 0 1 1-1h7l4 4v7.5a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1Z" />
      <path d="M10.5 4.5V9h4.5" />
      <path d="M5.5 12.5h3.5M5.5 15h6" />
    </IconBase>
  );
}

export function QuotesIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <path d="M5 2.5h6l3.5 3.5V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1Z" />
      <path d="M11 2.5V6h3.5" />
      <path d="M6.5 10h5M6.5 13h5" />
    </IconBase>
  );
}

export function OrderVolumeIcon({ size }: { size?: number }) {
  return (
    <IconBase size={size}>
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 5.5v9M12.5 7.7c0-1-1-1.7-2.5-1.7s-2.5.7-2.5 1.8c0 2.4 5 1 5 3.4 0 1.1-1.1 1.8-2.5 1.8s-2.5-.7-2.5-1.7" />
    </IconBase>
  );
}
