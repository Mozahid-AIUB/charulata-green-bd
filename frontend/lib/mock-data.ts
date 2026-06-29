export type Localized = { en: string; bn: string };

export type Product = {
  id: string;
  name: Localized;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  imageUrl: string;
  soldOut: boolean;
  category: string;
};

export type Category = {
  id: string;
  name: Localized;
  slug: string;
  imageUrl: string;
};

const IMG = {
  fruit: "https://images.unsplash.com/photo-1502741126161-b048400d085d?auto=format&fit=crop&w=600&q=80",
  flower: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80",
  ornamental: "https://images.unsplash.com/photo-1462530260150-162092dbf011?auto=format&fit=crop&w=600&q=80",
  palm: "https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=600&q=80",
};

export const categories: Category[] = [
  { id: "c1", name: { en: "Fruit Trees", bn: "ফল গাছ" }, slug: "fruit-trees", imageUrl: IMG.fruit },
  { id: "c2", name: { en: "Flower Plants", bn: "ফুল গাছ" }, slug: "flower-plants", imageUrl: IMG.flower },
  { id: "c3", name: { en: "Ornamental Plants", bn: "শোভাময় গাছ" }, slug: "ornamental-plants", imageUrl: IMG.ornamental },
  { id: "c4", name: { en: "Spice Plants", bn: "মশলা জাতীয় গাছ" }, slug: "spice-plants", imageUrl: IMG.ornamental },
  { id: "c5", name: { en: "Medicinal Plants", bn: "ঔষধি গাছ" }, slug: "medicinal-plants", imageUrl: IMG.ornamental },
  { id: "c6", name: { en: "Wood/Timber Trees", bn: "কাঠ গাছ" }, slug: "wood-timber-trees", imageUrl: IMG.fruit },
  { id: "c7", name: { en: "Vegetable Plants", bn: "সবজি জাতীয় গাছ" }, slug: "vegetable-plants", imageUrl: IMG.ornamental },
  { id: "c8", name: { en: "Gardening Tools", bn: "গার্ডেনিং টুলস" }, slug: "gardening-tools", imageUrl: IMG.palm },
  { id: "c9", name: { en: "Organic Fertilizers & Pesticides", bn: "জৈব সার ও কীটনাশক" }, slug: "fertilizers-pesticides", imageUrl: IMG.ornamental },
  { id: "c10", name: { en: "Pots & Geo-bags", bn: "টব ও জিও ব্যাগ" }, slug: "pots-geo-bags", imageUrl: IMG.palm },
];

export const products: Product[] = [
  { id: "p1", name: { en: "Cat's Claw Creeper", bn: "ক্যাট'স ক্ল ক্রিপার" }, slug: "cats-claw-creeper", priceMin: 600, priceMax: null, imageUrl: IMG.flower, soldOut: false, category: "flower-plants" },
  { id: "p2", name: { en: "Golden Shower", bn: "সোনালু" }, slug: "golden-shower", priceMin: 500, priceMax: null, imageUrl: IMG.flower, soldOut: false, category: "flower-plants" },
  { id: "p3", name: { en: "Rambutan", bn: "রাম্বুটান" }, slug: "rambutan", priceMin: 350, priceMax: 800, imageUrl: IMG.fruit, soldOut: false, category: "fruit-trees" },
  { id: "p4", name: { en: "Avocado", bn: "অ্যাভোকাডো" }, slug: "avocado", priceMin: 400, priceMax: 900, imageUrl: IMG.fruit, soldOut: false, category: "fruit-trees" },
  { id: "p5", name: { en: "Guava", bn: "পেয়ারা" }, slug: "guava", priceMin: 150, priceMax: 350, imageUrl: IMG.fruit, soldOut: true, category: "fruit-trees" },
  { id: "p6", name: { en: "Erica Palm", bn: "এরিকা পাম" }, slug: "erica-palm", priceMin: 100, priceMax: 185, imageUrl: IMG.palm, soldOut: false, category: "ornamental-plants" },
  { id: "p7", name: { en: "Camellia", bn: "ক্যামেলিয়া" }, slug: "camellia", priceMin: 500, priceMax: null, imageUrl: IMG.flower, soldOut: false, category: "flower-plants" },
  { id: "p8", name: { en: "Bougainvillea", bn: "বাগানবিলাস" }, slug: "bougainvillea", priceMin: 250, priceMax: 600, imageUrl: IMG.ornamental, soldOut: false, category: "ornamental-plants" },
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
