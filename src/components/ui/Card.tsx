import Link from "next/link";

interface CardProps {
  title: string;
  description: string;
  href: string;
  image?: string;
  badge?: string;
}

export function Card({ title, description, href, badge }: CardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-gray-200 p-5 transition hover:border-aqua-300 hover:shadow-md"
    >
      {badge && (
        <span className="mb-2 inline-block rounded-full bg-aqua-100 px-2 py-0.5 text-xs font-medium text-aqua-800">
          {badge}
        </span>
      )}
      <h3 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
        {title}
      </h3>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
    </Link>
  );
}
