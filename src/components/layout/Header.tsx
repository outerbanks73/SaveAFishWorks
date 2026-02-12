import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { NotificationBell } from "./NotificationBell";
import { HeaderSearch } from "@/components/search/HeaderSearch";

const NAV_LINKS = [
  { label: "Configurator", href: "/configurator" },
  { label: "Fish", href: "/fish" },
  { label: "Guides", href: "/guides" },
  { label: "Products", href: "/products" },
  { label: "Best Of", href: "/best" },
  { label: "Compare", href: "/compare" },
  { label: "Glossary", href: "/glossary" },
];

export function Header() {
  return (
    <header className="border-b border-aqua-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-aqua-800">
          Aquatic Motiv
        </Link>
        <nav className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ocean-900 hover:text-aqua-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <HeaderSearch />
          <NotificationBell />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
