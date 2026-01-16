import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { client } from "../lib/client";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    try {
      const res = await client.api.auth.custom.me.$get();
      if (!res.ok) {
        throw redirect({ to: "/login" });
      }
      const data = await res.json();
      if (data.user?.role !== "ADMIN") {
        throw redirect({ to: "/login" });
      }
      return { user: data.user };
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  pendingComponent: () => (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p>Loading...</p>
    </div>
  ),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <a href="/admin">Dashboard</a>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
