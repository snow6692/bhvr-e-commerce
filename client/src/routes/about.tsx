import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: about });

function about() {
  return <div>about</div>;
}

export default about;
