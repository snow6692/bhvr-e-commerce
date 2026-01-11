import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <Card className="w-full max-w-sm overflow-hidden flex flex-col">
      {/* Image Skeleton */}
      <div className="aspect-4/3 w-full">
        <Skeleton className="h-full w-full rounded-b-none" />
      </div>

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          {/* Title Skeleton */}
          <Skeleton className="h-6 w-3/4" />
          {/* Price Skeleton */}
          <Skeleton className="h-6 w-16" />
        </div>
      </CardHeader>

      <CardContent className="grow space-y-2">
        {/* Description Skeleton (2 lines) */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        {/* Stock Text Skeleton */}
        <Skeleton className="h-4 w-20" />
        {/* Button Skeleton */}
        <Skeleton className="h-9 w-24 rounded-md" />
      </CardFooter>
    </Card>
  );
}
