type IconKind = "chart" | "shield" | "factory" | "arena";

export function ProductIcon({ kind }: { kind: IconKind }) {
  const props = {
    width: 26,
    height: 26,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#06070d",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (kind) {
    case "chart":
      return (
        <svg {...props}>
          <path d="M3 3v18h18" />
          <rect x="6.5" y="11" width="2.4" height="6" rx="1" />
          <rect x="11.8" y="7" width="2.4" height="10" rx="1" />
          <rect x="17" y="9" width="2.4" height="8" rx="1" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 5 6v5c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6l-7-3Z" />
          <path d="m9 11.5 2 2 4-4.5" />
        </svg>
      );
    case "factory":
      return (
        <svg {...props}>
          <path d="m12 2 3 5 3-5" />
          <path d="M3 21V10l5 3 4-3 4 3 5-3v11Z" />
          <path d="M3 21h18" />
        </svg>
      );
    case "arena":
      return (
        <svg {...props}>
          <path d="M6 9V4h3l2 2.5L9 9 6 9Z" />
          <path d="M18 9V4h-3l-2 2.5L15 9l3 0Z" />
          <path d="M9 9c0 4 1.5 6 3 6s3-2 3-6" />
          <path d="M12 15v3" />
          <path d="M8 21h8" />
          <path d="M9.5 18h5" />
        </svg>
      );
  }
}
