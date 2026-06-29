import { setRequestLocale } from "next-intl/server";
import { CategorySidebar } from "@/components/layout/CategorySidebar";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { TopSellers } from "@/components/home/TopSellers";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { getCategories } from "@/lib/mock-data";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const categories = getCategories();

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      {/* sidebar · hero · top-sellers — the charulata homepage grid (desktop) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_1fr_20rem]">
        <div className="hidden lg:block">
          <CategorySidebar />
        </div>
        <HeroCarousel />
        <div className="hidden lg:block">
          <TopSellers compact />
        </div>
      </div>

      {/* mobile/tablet: category menu + top sellers stacked below the hero */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
        <CategorySidebar />
        <TopSellers compact />
      </div>

      {/* full-width category rows */}
      {categories.map((category) => (
        <CategoryShowcase key={category.id} category={category} />
      ))}
    </main>
  );
}
