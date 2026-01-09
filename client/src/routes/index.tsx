import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return <Button asChild>
    <Link to="/about">About</Link>
  </Button>;
}
