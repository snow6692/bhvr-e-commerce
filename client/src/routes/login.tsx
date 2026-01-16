import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/use-auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, isLoggingIn, isAuthenticated, isLoading, role } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect if already authenticated (in useEffect to avoid render-time navigation)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === "ADMIN") {
        navigate({ to: "/admin" });
      } else if (role === "TEACHER") {
        navigate({ to: "/teacher" });
      } else {
        navigate({ to: "/" });
      }
    }
  }, [isLoading, isAuthenticated, role, navigate]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(
        { email, password },
        {
          onSuccess: (data: any) => {
            // better-auth returns { user: {...}, token: "..." }
            const userRole = data?.user?.role;
            if (userRole === "ADMIN") {
              navigate({ to: "/admin" });
            } else if (userRole === "TEACHER") {
              navigate({ to: "/teacher" });
            } else {
              navigate({ to: "/" });
            }
          },
          onError: (err: any) => {
            setError(err.message || "Login failed");
          },
        },
      );
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoggingIn}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoggingIn}
            />
          </div>
          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
