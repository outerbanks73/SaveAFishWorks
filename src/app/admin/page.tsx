import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/admin/StatsCard";
import { getAllGuides } from "@/lib/data/guides";
import { getAllFish } from "@/lib/data/fish";
import { getAllGlossaryTerms } from "@/lib/data/glossary";
import { getAllComparisons } from "@/lib/data/comparisons";
import { getAllCurationLists } from "@/lib/data/curation";
import { getAllProducts } from "@/lib/data/products";

export default async function AdminDashboard() {
  const [userCount, tankCount, adminProductCount, overdueTasks, guides, fish, glossary, comparisons, curation, products] = await Promise.all([
    prisma.user.count(),
    prisma.tank.count(),
    prisma.adminProduct.count(),
    prisma.maintenanceTask.count({ where: { nextDue: { lt: new Date() } } }),
    getAllGuides(),
    getAllFish(),
    getAllGlossaryTerms(),
    getAllComparisons(),
    getAllCurationLists(),
    getAllProducts(),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Admin Dashboard</h1>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ocean-900/50">Platform</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total Users" value={userCount} icon="👥" />
        <StatsCard label="Total Tanks" value={tankCount} icon="🐠" />
        <StatsCard label="Admin Products" value={adminProductCount} icon="📦" />
        <StatsCard label="Overdue Tasks" value={overdueTasks} icon="⚠️" />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ocean-900/50">Content</h2>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard label="Guides" value={guides.length} icon="📖" />
        <StatsCard label="Fish Species" value={fish.length} icon="🐟" />
        <StatsCard label="Products" value={products.length} icon="🛒" />
        <StatsCard label="Glossary Terms" value={glossary.length} icon="📚" />
        <StatsCard label="Comparisons" value={comparisons.length} icon="⚖️" />
        <StatsCard label="Curation Lists" value={curation.length} icon="🏆" />
      </div>
    </div>
  );
}
