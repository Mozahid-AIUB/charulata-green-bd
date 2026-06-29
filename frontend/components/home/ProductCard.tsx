import Image from "next/image";
import type { Product } from "@/lib/mock-data";

function formatPrice(product: Product): string {
  if (product.priceMax === null) {
    return `৳${product.priceMin}`;
  }
  return `৳${product.priceMin} – ৳${product.priceMax}`;
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-square w-full bg-brand-50">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
        />
        {product.soldOut && (
          <span className="absolute left-2 top-2 rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="text-sm font-medium text-brand-900">{product.name}</h3>
        <p className="text-sm font-semibold text-brand-700">{formatPrice(product)}</p>
        <button
          type="button"
          disabled={product.soldOut}
          className="mt-2 rounded bg-brand-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {product.soldOut ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
