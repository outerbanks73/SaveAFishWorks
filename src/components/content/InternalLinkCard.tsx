import Link from "next/link";

interface InternalLinkCardProps {
  title: string;
  description: string;
  href: string;
}

export function InternalLinkCard({
  title,
  description,
  href,
}: InternalLinkCardProps) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-aqua-200 bg-aqua-50 p-4 transition hover:border-aqua-400"
    >
      <p className="font-medium text-aqua-800">{title}</p>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </Link>
  );
}
