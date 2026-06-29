export type Product = {
  id: string;
  name: string;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  imageUrl: string;
  soldOut: boolean;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
};

export const categories: Category[] = [
  { id: "c1", name: "Fruit Trees", slug: "fruit-trees", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c2", name: "Flower Plants", slug: "flower-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c3", name: "Ornamental Plants", slug: "ornamental-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c4", name: "Spice Plants", slug: "spice-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c5", name: "Medicinal Plants", slug: "medicinal-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c6", name: "Wood/Timber Trees", slug: "wood-timber-trees", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c7", name: "Vegetable Plants", slug: "vegetable-plants", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c8", name: "Gardening Tools", slug: "gardening-tools", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c9", name: "Organic Fertilizers & Pesticides", slug: "fertilizers-pesticides", imageUrl: "/images/placeholder-plant.svg" },
  { id: "c10", name: "Pots & Geo-bags", slug: "pots-geo-bags", imageUrl: "/images/placeholder-plant.svg" },
];

export const products: Product[] = [
  { id: "p1", name: "Cat's Claw Creeper", slug: "cats-claw-creeper", priceMin: 600, priceMax: null, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "flower-plants" },
  { id: "p2", name: "Golden Shower", slug: "golden-shower", priceMin: 500, priceMax: null, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "flower-plants" },
  { id: "p3", name: "Rambutan", slug: "rambutan", priceMin: 350, priceMax: 800, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "fruit-trees" },
  { id: "p4", name: "Avocado", slug: "avocado", priceMin: 400, priceMax: 900, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "fruit-trees" },
  { id: "p5", name: "Guava", slug: "guava", priceMin: 150, priceMax: 350, imageUrl: "/images/placeholder-plant.svg", soldOut: true, category: "fruit-trees" },
  { id: "p6", name: "Erica Palm", slug: "erica-palm", priceMin: 100, priceMax: 185, imageUrl: "/images/placeholder-plant.svg", soldOut: false, category: "ornamental-plants" },
];

export function getTopSellers(): Product[] {
  return products.slice(0, 4);
}

export function getCategories(): Category[] {
  return categories;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug);
}
