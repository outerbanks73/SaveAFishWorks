import { Badge } from "@/components/ui/Badge";

const DIFFICULTY_MAP = {
  beginner: { label: "Beginner Friendly", variant: "success" as const },
  intermediate: { label: "Intermediate", variant: "warning" as const },
  advanced: { label: "Advanced", variant: "danger" as const },
};

interface DifficultyBadgeProps {
  difficulty: "beginner" | "intermediate" | "advanced";
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const { label, variant } = DIFFICULTY_MAP[difficulty];
  return <Badge variant={variant}>{label}</Badge>;
}
