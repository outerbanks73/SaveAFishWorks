import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session || (role !== "ADMIN" && role !== "EDITOR")) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex flex-col gap-8 md:flex-row">
        <AdminSidebar role={role} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
