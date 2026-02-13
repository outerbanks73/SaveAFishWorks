import Link from "next/link";

interface AdminPageHeaderProps {
  title: string;
  count?: number;
  addHref?: string;
  addLabel?: string;
}

export function AdminPageHeader({ title, count, addHref, addLabel = "Add New" }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-ocean-900">{title}</h1>
        {count !== undefined && (
          <span className="rounded-full bg-aqua-100 px-2.5 py-0.5 text-xs font-semibold text-aqua-700">
            {count}
          </span>
        )}
      </div>
      {addHref && (
        <Link
          href={addHref}
          className="rounded-lg bg-aqua-600 px-4 py-2 text-sm font-medium text-white hover:bg-aqua-700"
        >
          {addLabel}
        </Link>
      )}
    </div>
  );
}
