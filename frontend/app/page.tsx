import { Hero } from "@/components/home/Hero";
import { TopSellers } from "@/components/home/TopSellers";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { getCategories } from "@/lib/mock-data";

export default function Home() {
  const categories = getCategories();

  return (
    <main>
      <Hero />
      <TopSellers />
      {categories.map((category) => (
        <CategoryShowcase key={category.id} category={category} />
      ))}
    </main>
  );
}
