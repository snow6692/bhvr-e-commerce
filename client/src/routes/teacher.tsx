import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { client } from "../lib/client";

export const Route = createFileRoute("/teacher")({
  beforeLoad: async () => {
    try {
      const res = await client.api.auth.custom.me.$get();
      if (!res.ok) {
        throw redirect({ to: "/login" });
      }
      const data = await res.json();
      if (data.user?.role !== "TEACHER") {
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
  component: TeacherLayout,
});

function TeacherLayout() {
  return (
    <div className="teacher-layout">
      <aside className="teacher-sidebar">
        <h2>Teacher Panel</h2>
        <nav>
          <a href="/teacher">Dashboard</a>
        </nav>
      </aside>
      <main className="teacher-content">
        <Outlet />
      </main>
    </div>
  );
}
