"use client";

import { useState } from "react";
import Link from "next/link";

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  createdAt: string;
  _count: { tanks: number; savedConfigurations: number };
}

export function UserTable({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      (u.name?.toLowerCase().includes(search.toLowerCase()) ?? false) ||
      (u.email?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  async function handleRoleChange(userId: string, newRole: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    }
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm"
      />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left">
              <th className="pb-3 font-medium text-ocean-900">User</th>
              <th className="pb-3 font-medium text-ocean-900">Role</th>
              <th className="pb-3 font-medium text-ocean-900">Tanks</th>
              <th className="pb-3 font-medium text-ocean-900">Configs</th>
              <th className="pb-3 font-medium text-ocean-900">Joined</th>
              <th className="pb-3 font-medium text-ocean-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-gray-100">
                <td className="py-3">
                  <p className="font-medium text-ocean-900">{user.name ?? "—"}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </td>
                <td className="py-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 text-xs"
                  >
                    <option value="HOBBYIST">Hobbyist</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="py-3 text-gray-600">{user._count.tanks}</td>
                <td className="py-3 text-gray-600">{user._count.savedConfigurations}</td>
                <td className="py-3 text-xs text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="py-3">
                  <Link href={`/admin/users/${user.id}`} className="text-xs font-medium text-aqua-600 hover:text-aqua-700">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
