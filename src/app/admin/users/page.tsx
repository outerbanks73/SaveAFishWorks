import { prisma } from "@/lib/db";
import { UserTable } from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { tanks: true, savedConfigurations: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    updatedAt: u.updatedAt.toISOString(),
    emailVerified: u.emailVerified?.toISOString() ?? null,
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ocean-900">Users ({users.length})</h1>
      <UserTable initialUsers={serialized} />
    </div>
  );
}
