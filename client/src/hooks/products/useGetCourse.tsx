import { client } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { Product } from "shared";

async function fetchProducts(): Promise<Product[]> {
  const res = await client..$get();
  if (!res.ok) throw new Error(res.statusText);
  return await res.json();
}

export default function useProducts() {
  return useQuery({
    queryKey: ["courses"],
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: fetchProducts,
  });
}
