import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";


export const Route = createFileRoute("/")({ component: App });

function App() {
 

  return (
    <div>
      <h1>Welcome to BHVR Client!</h1>
      <Link to="/about">
        <Button>Go to About Page</Button>
      </Link>
  
    </div>
  );
}
