import { Link } from "@tanstack/react-router";

import { ShoppingBag } from "lucide-react";

export function Header() {
  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
          <ShoppingBag className="h-6 w-6" />
          <span>Store</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/products"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Products
          </Link>
          {/* <Link to="/products">
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </Link> */}
        </nav>
      </div>
    </header>
  );
}
