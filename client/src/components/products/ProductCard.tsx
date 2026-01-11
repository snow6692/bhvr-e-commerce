import { Product } from "shared";
import { Badge } from "@/components/ui/badge"; // Make sure to import Badge
import { Button } from "@/components/ui/button"; // Optional: for the action button
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react"; // Optional: Icon for the button

export default function ProductCard({ product }: { product: Product }) {
  // Helper to format currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <Card className="w-full max-w-sm overflow-hidden transition-all hover:shadow-lg flex flex-col">
      {/* Image Section with floating Badge */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge className="absolute right-3 top-3 uppercase" variant="secondary">
          {product.category}
        </Badge>
      </div>

      {/* Header: Name and Price */}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-1 text-lg" title={product.name}>
            {product.name}
          </CardTitle>
          <span className="text-lg font-bold text-primary">
            {formattedPrice}
          </span>
        </div>
      </CardHeader>

      {/* Content: Description */}
      <CardContent className="grow">
        <CardDescription className="line-clamp-2 text-sm">
          {product.description}
        </CardDescription>
      </CardContent>

      {/* Footer: Stock info and Action Button */}
      <CardFooter className="flex items-center justify-between border-t p-4 bg-muted/20">
        <div className="text-xs text-muted-foreground">
          {product.stock > 0 ? (
            <span
              className={`${product.stock < 10 ? "text-orange-500" : "text-green-600"} font-medium`}
            >
              {product.stock} in stock
            </span>
          ) : (
            <span className="text-destructive font-medium">Out of stock</span>
          )}
        </div>

        <Button size="sm" disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
