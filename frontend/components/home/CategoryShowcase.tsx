import Link from "next/link";
import { getProductsByCategory, type Category } from "@/lib/mock-data";
import { ProductCard } from "./ProductCard";

export function CategoryShowcase({ category }: { category: Category }) {
  const products = getProductsByCategory(category.slug);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-brand-900">{category.name}</h2>
        <Link
          href={`/shop?category=${category.slug}`}
          className="text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          View all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
