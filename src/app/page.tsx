import Link from "next/link";
import { getAllFish } from "@/lib/data/fish";
import { getAllGuides } from "@/lib/data/guides";
import { getAllCurationLists } from "@/lib/data/curation";
import { Card } from "@/components/ui/Card";
import { DifficultyBadge } from "@/components/fish/DifficultyBadge";
import { HomeSearch } from "@/components/search/HomeSearch";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const CATEGORIES = [
  { title: "Fish Profiles", href: "/fish", icon: "🐠", description: "Care guides for 100+ species" },
  { title: "Care Guides", href: "/guides", icon: "📖", description: "Expert tank setup and maintenance guides" },
  { title: "Products", href: "/products", icon: "🛒", description: "Equipment reviews and recommendations" },
  { title: "Best Of Lists", href: "/best", icon: "🏆", description: "Curated picks from our experts" },
  { title: "Comparisons", href: "/compare", icon: "⚖️", description: "Head-to-head equipment comparisons" },
  { title: "Glossary", href: "/glossary", icon: "📚", description: "Aquarium terminology explained" },
];

export default async function HomePage() {
  const fish = getAllFish().slice(0, 6);
  const guides = getAllGuides().slice(0, 4);
  const lists = getAllCurationLists().slice(0, 3);

  const session = await auth();
  let userTanks: Array<{ id: string; name: string; gallons: number }> = [];
  let upcomingTasks: Array<{ id: string; title: string; nextDue: Date; tank: { name: string } }> = [];

  if (session?.user?.id) {
    [userTanks, upcomingTasks] = await Promise.all([
      prisma.tank.findMany({
        where: { userId: session.user.id },
        select: { id: true, name: true, gallons: true },
        take: 3,
      }),
      prisma.maintenanceTask.findMany({
        where: {
          userId: session.user.id,
          nextDue: { lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { nextDue: "asc" },
        take: 5,
        include: { tank: { select: { name: true } } },
      }),
    ]);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Hero with search */}
      <section className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold text-ocean-900 md:text-5xl">
          Your Complete Aquarium Resource
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          Find fish, guides, products, and everything you need to build a thriving aquarium.
        </p>
        <HomeSearch />
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/for/beginners" className="rounded-lg bg-aqua-600 px-6 py-3 font-medium text-white hover:bg-aqua-700">
            Start Here
          </Link>
          <Link href="/configurator" className="rounded-lg border border-aqua-300 px-6 py-3 font-medium text-aqua-700 hover:bg-aqua-50">
            Build Your Aquascape
          </Link>
          <Link href="/fish" className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-ocean-900 hover:bg-gray-50">
            Browse Fish
          </Link>
        </div>
      </section>

      {/* Content categories grid */}
      <section className="mb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group rounded-lg border border-gray-200 p-5 transition hover:border-aqua-300 hover:shadow-md"
            >
              <span className="text-2xl">{cat.icon}</span>
              <h2 className="mt-2 font-semibold text-ocean-900 group-hover:text-aqua-700">
                {cat.title}
              </h2>
              <p className="mt-1 text-sm text-gray-600">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Logged-in user section */}
      {session && (userTanks.length > 0 || upcomingTasks.length > 0) && (
        <section className="mb-16 rounded-xl border border-aqua-200 bg-aqua-50/30 p-6">
          <h2 className="mb-4 text-xl font-bold text-ocean-900">
            Welcome back, {session.user.name?.split(" ")[0] ?? "there"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {userTanks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase text-ocean-900/60">Your Tanks</h3>
                <div className="space-y-2">
                  {userTanks.map((t) => (
                    <Link key={t.id} href={`/dashboard/tanks/${t.id}`} className="block rounded-lg bg-white p-3 text-sm font-medium text-ocean-900 shadow-sm hover:shadow">
                      {t.name} — {t.gallons}G
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {upcomingTasks.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase text-ocean-900/60">Upcoming Maintenance</h3>
                <div className="space-y-2">
                  {upcomingTasks.map((t) => (
                    <div key={t.id} className={`rounded-lg bg-white p-3 text-sm shadow-sm ${t.nextDue < new Date() ? "border-l-4 border-red-400" : ""}`}>
                      <p className="font-medium text-ocean-900">{t.title}</p>
                      <p className="text-xs text-gray-500">{t.tank.name} &middot; {t.nextDue < new Date() ? "Overdue" : `Due ${t.nextDue.toLocaleDateString()}`}</p>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard/maintenance" className="mt-3 inline-block text-xs font-medium text-aqua-600 hover:text-aqua-700">
                  View all maintenance &rarr;
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popular Fish */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-900">Popular Fish</h2>
          <Link href="/fish" className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fish.map((f) => (
            <Link
              key={f.slug}
              href={`/fish/${f.slug}`}
              className="group rounded-lg border border-gray-200 p-4 transition hover:border-aqua-300 hover:shadow-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">{f.waterType}</span>
                <DifficultyBadge difficulty={f.difficulty} />
              </div>
              <h3 className="font-semibold text-ocean-900 group-hover:text-aqua-700">
                {f.commonName}
              </h3>
              <p className="text-sm italic text-gray-500">{f.scientificName}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Configurator CTA */}
      <section className="mb-16 rounded-xl bg-gradient-to-r from-aqua-600 to-aqua-700 p-8 text-center text-white">
        <h2 className="text-2xl font-bold">Build Your Aquascape</h2>
        <p className="mx-auto mt-2 max-w-lg text-aqua-100">
          Use our interactive configurator to select a tank, browse products, check compatibility, and build your perfect setup.
        </p>
        <Link href="/configurator" className="mt-6 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-aqua-700 hover:bg-aqua-50">
          Open Configurator
        </Link>
      </section>

      {/* Latest Guides */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-900">Latest Guides</h2>
          <Link href="/guides" className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {guides.map((guide) => (
            <Card
              key={guide.slug}
              title={guide.title}
              description={guide.description}
              href={`/guides/${guide.slug}`}
              badge={guide.readingTime}
            />
          ))}
        </div>
      </section>

      {/* Top Lists */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-ocean-900">Top Picks</h2>
          <Link href="/best" className="text-sm font-medium text-aqua-600 hover:text-aqua-700">
            View all &rarr;
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {lists.map((list) => (
            <Card
              key={list.slug}
              title={list.title}
              description={list.description}
              href={`/best/${list.slug}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
