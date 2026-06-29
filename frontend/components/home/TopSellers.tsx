import { getTopSellers } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function TopSellers() {
  const products = getTopSellers();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-semibold text-brand-900">Top Sellers</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
