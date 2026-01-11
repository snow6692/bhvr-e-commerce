import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NoProductsProps {
  onClearFilters?: () => void;
}

export function NoProducts({ onClearFilters }: NoProductsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-4 mb-4">
        <PackageOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">
        No products found
      </h3>
      <p className="text-muted-foreground mt-2 mb-6 max-w-sm">
        We couldn't find any products in our inventory at the moment. Please
        check back later.
      </p>
      {onClearFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
