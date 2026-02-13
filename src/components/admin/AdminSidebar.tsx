"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavSection {
  title: string;
  items: { label: string; href: string; icon: string }[];
}

function getSections(role: string): NavSection[] {
  const sections: NavSection[] = [
    {
      title: "Overview",
      items: [{ label: "Dashboard", href: "/admin", icon: "📊" }],
    },
    {
      title: "Content",
      items: [
        { label: "Guides", href: "/admin/guides", icon: "📖" },
        { label: "Fish Species", href: "/admin/fish", icon: "🐠" },
        { label: "Products", href: "/admin/content-products", icon: "🛒" },
        { label: "Glossary", href: "/admin/glossary", icon: "📚" },
        { label: "Comparisons", href: "/admin/comparisons", icon: "⚖️" },
        { label: "Curation Lists", href: "/admin/curation", icon: "🏆" },
      ],
    },
    {
      title: "Configurator",
      items: [
        { label: "Shopify Products", href: "/admin/configurator/products", icon: "🏪" },
        { label: "Templates", href: "/admin/configurator/templates", icon: "🎨" },
        { label: "Categories", href: "/admin/configurator/categories", icon: "📂" },
      ],
    },
  ];

  if (role === "ADMIN") {
    sections.push({
      title: "System",
      items: [
        { label: "Users", href: "/admin/users", icon: "👥" },
        { label: "Admin Products", href: "/admin/products", icon: "📦" },
      ],
    });
  }

  return sections;
}

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const sections = getSections(role);

  return (
    <aside className="w-full shrink-0 md:w-56">
      <div className="mb-4 rounded-lg bg-red-50 px-3 py-2">
        <p className="text-xs font-semibold uppercase text-red-600">Admin Portal</p>
      </div>
      <nav className="flex flex-col gap-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-ocean-900/40">
              {section.title}
            </p>
            <div className="flex gap-1 overflow-x-auto md:flex-col">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-aqua-50 text-aqua-700"
                        : "text-ocean-900/60 hover:bg-gray-50 hover:text-ocean-900"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
