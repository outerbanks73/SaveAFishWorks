const VARIANTS = {
  default: "bg-aqua-100 text-aqua-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-ocean-100 text-ocean-800",
} as const;

interface BadgeProps {
  children: React.ReactNode;
  variant?: keyof typeof VARIANTS;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
