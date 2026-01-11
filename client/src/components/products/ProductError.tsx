import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProductErrorProps {
  message?: string;
  onRetry?: () => void;
}

export default function ProductError({
  message = "Error loading products.",
  onRetry,
}: ProductErrorProps) {
  return (
    <div className="flex justify-center items-center min-h-[50vh] w-full p-4">
      <Card className="w-full max-w-md border-destructive/50 bg-destructive/5 shadow-sm">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-destructive/10 animate-pulse">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl text-destructive">
            Something went wrong
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center text-muted-foreground">
          <p>{message}</p>
        </CardContent>

        {onRetry && (
          <CardFooter className="flex justify-center pt-2">
            <Button
              variant="outline"
              onClick={onRetry}
              className="gap-2 border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
