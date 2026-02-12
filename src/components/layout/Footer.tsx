import Link from "next/link";

const FOOTER_CLUSTERS = [
  {
    title: "Fish Profiles",
    links: [
      { label: "All Fish", href: "/fish" },
      { label: "Betta Splendens", href: "/fish/betta-splendens" },
      { label: "Neon Tetra", href: "/fish/neon-tetra" },
      { label: "Corydoras", href: "/fish/corydoras-catfish" },
    ],
  },
  {
    title: "Guides",
    links: [
      { label: "All Guides", href: "/guides" },
      { label: "Betta Care", href: "/guides/betta-fish-care" },
      { label: "Cycling a Tank", href: "/guides/how-to-cycle-aquarium" },
      { label: "Planted Tanks", href: "/guides/planted-tank-setup" },
    ],
  },
  {
    title: "Products",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Filters", href: "/products/filters" },
      { label: "Heaters", href: "/products/heaters" },
      { label: "Lighting", href: "/products/lighting" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Glossary", href: "/glossary" },
      { label: "Best Of Lists", href: "/best" },
      { label: "Comparisons", href: "/compare" },
      { label: "For Beginners", href: "/for/beginners" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-aqua-100 bg-ocean-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {FOOTER_CLUSTERS.map((cluster) => (
            <div key={cluster.title}>
              <h3 className="mb-3 text-sm font-semibold text-aqua-400">
                {cluster.title}
              </h3>
              <ul className="space-y-2">
                {cluster.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Aquatic Motiv. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
