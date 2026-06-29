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

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

// distinct image per category + per product so nothing looks repeated/fake
const CAT_IMG = {
  fruit: u("photo-1502741126161-b048400d085d"),
  flower: u("photo-1490750967868-88aa4486c946"),
  ornamental: u("photo-1462530260150-162092dbf011"),
  spice: u("photo-1599940824399-b87987ceb72a"),
  medicinal: u("photo-1611073615830-9f76eba94f8a"),
  wood: u("photo-1448375240586-882707db888b"),
  vegetable: u("photo-1416879595882-3373a0480b5b"),
  tools: u("photo-1416339306562-f3d12fefd36f"),
  fertilizer: u("photo-1585314062340-f1a5a7c9328d"),
  pots: u("photo-1485955900006-10f4d324d411"),
};

export const categories: Category[] = [
  { id: "c1", name: { en: "Fruit Trees", bn: "ফল গাছ" }, slug: "fruit-trees", imageUrl: CAT_IMG.fruit },
  { id: "c2", name: { en: "Flower Plants", bn: "ফুল গাছ" }, slug: "flower-plants", imageUrl: CAT_IMG.flower },
  { id: "c3", name: { en: "Ornamental Plants", bn: "শোভাময় গাছ" }, slug: "ornamental-plants", imageUrl: CAT_IMG.ornamental },
  { id: "c4", name: { en: "Spice Plants", bn: "মশলা জাতীয় গাছ" }, slug: "spice-plants", imageUrl: CAT_IMG.spice },
  { id: "c5", name: { en: "Medicinal Plants", bn: "ঔষধি গাছ" }, slug: "medicinal-plants", imageUrl: CAT_IMG.medicinal },
  { id: "c6", name: { en: "Wood/Timber Trees", bn: "কাঠ গাছ" }, slug: "wood-timber-trees", imageUrl: CAT_IMG.wood },
  { id: "c7", name: { en: "Vegetable Plants", bn: "সবজি জাতীয় গাছ" }, slug: "vegetable-plants", imageUrl: CAT_IMG.vegetable },
  { id: "c8", name: { en: "Gardening Tools", bn: "গার্ডেনিং টুলস" }, slug: "gardening-tools", imageUrl: CAT_IMG.tools },
  { id: "c9", name: { en: "Organic Fertilizers & Pesticides", bn: "জৈব সার ও কীটনাশক" }, slug: "fertilizers-pesticides", imageUrl: CAT_IMG.fertilizer },
  { id: "c10", name: { en: "Pots & Geo-bags", bn: "টব ও জিও ব্যাগ" }, slug: "pots-geo-bags", imageUrl: CAT_IMG.pots },
];

export const products: Product[] = [
  { id: "p1", name: { en: "Cat's Claw Creeper", bn: "ক্যাট'স ক্ল ক্রিপার" }, slug: "cats-claw-creeper", priceMin: 600, priceMax: null, imageUrl: u("photo-1524598171302-fbe4b0cee0d4"), soldOut: false, category: "flower-plants" },
  { id: "p2", name: { en: "Golden Shower", bn: "সোনালু" }, slug: "golden-shower", priceMin: 500, priceMax: null, imageUrl: u("photo-1597848212624-e19a1f8a47b8"), soldOut: false, category: "flower-plants" },
  { id: "p3", name: { en: "Rambutan", bn: "রাম্বুটান" }, slug: "rambutan", priceMin: 350, priceMax: 800, imageUrl: u("photo-1564507592333-c60657eea523"), soldOut: false, category: "fruit-trees" },
  { id: "p4", name: { en: "Avocado", bn: "অ্যাভোকাডো" }, slug: "avocado", priceMin: 400, priceMax: 900, imageUrl: u("photo-1523049673857-eb18f1d7b578"), soldOut: false, category: "fruit-trees" },
  { id: "p5", name: { en: "Guava", bn: "পেয়ারা" }, slug: "guava", priceMin: 150, priceMax: 350, imageUrl: u("photo-1536511132770-e5058c7e8c46"), soldOut: true, category: "fruit-trees" },
  { id: "p6", name: { en: "Erica Palm", bn: "এরিকা পাম" }, slug: "erica-palm", priceMin: 100, priceMax: 185, imageUrl: u("photo-1545241047-6083a3684587"), soldOut: false, category: "ornamental-plants" },
  { id: "p7", name: { en: "Camellia", bn: "ক্যামেলিয়া" }, slug: "camellia", priceMin: 500, priceMax: null, imageUrl: u("photo-1597586124394-fbd6ef244026"), soldOut: false, category: "flower-plants" },
  { id: "p8", name: { en: "Bougainvillea", bn: "বাগানবিলাস" }, slug: "bougainvillea", priceMin: 250, priceMax: 600, imageUrl: u("photo-1558693168-c370615b54e0"), soldOut: false, category: "ornamental-plants" },
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
