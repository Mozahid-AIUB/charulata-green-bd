export type Localized = { en: string; bn: string };

export type Product = {
  id: string;
  name: Localized;
  slug: string;
  priceMin: number;
  priceMax: number | null;
  /** original (pre-discount) price; when set and > priceMin, a discount is shown */
  originalPrice?: number | null;
  imageUrl: string;
  soldOut: boolean;
  category: string;
};

/** discount % from original→current, or null if no discount */
export function discountPercent(p: Product): number | null {
  if (!p.originalPrice || p.originalPrice <= p.priceMin) return null;
  return Math.round((1 - p.priceMin / p.originalPrice) * 100);
}

export type Category = {
  id: string;
  name: Localized;
  slug: string;
  imageUrl: string;
};

const u = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

/**
 * IMG: a pool of Unsplash photo IDs each VISUALLY VERIFIED to show the right
 * subject (no buildings/people/404s). Keep using only these known-good IDs.
 */
const IMG = {
  avocado: "photo-1523049673857-eb18f1d7b578", // avocado half
  apple: "photo-1568702846914-96b305d2aaeb", // red apple
  greenApple: "photo-1536511132770-e5058c7e8c46", // green apples
  succulent: "photo-1485955900006-10f4d324d411", // succulent in pot
  lavender: "photo-1565011523534-747a8601f10a", // lavender in pot
  seedlings: "photo-1466692476868-aef1dfb1e735", // seedlings / green field
  soil: "photo-1416879595882-3373a0480b5b", // soil / seeding
} as const;

const CAT_IMG = {
  fruit: u(IMG.apple),
  flower: u(IMG.lavender),
  ornamental: u(IMG.succulent),
  spice: u(IMG.seedlings),
  medicinal: u(IMG.succulent),
  wood: u(IMG.seedlings),
  vegetable: u(IMG.greenApple),
  tools: u(IMG.soil),
  fertilizer: u(IMG.soil),
  pots: u(IMG.succulent),
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
  // --- Fruit Trees ---
  { id: "p3", name: { en: "Rambutan", bn: "রাম্বুটান" }, slug: "rambutan", priceMin: 350, priceMax: 800, imageUrl: u(IMG.greenApple), soldOut: false, category: "fruit-trees" },
  { id: "p4", name: { en: "Avocado", bn: "অ্যাভোকাডো" }, slug: "avocado", priceMin: 400, priceMax: 900, imageUrl: u(IMG.avocado), soldOut: false, category: "fruit-trees" },
  { id: "p5", name: { en: "Guava", bn: "পেয়ারা" }, slug: "guava", priceMin: 150, priceMax: 350, imageUrl: u(IMG.greenApple), soldOut: true, category: "fruit-trees" },
  { id: "p9", name: { en: "Red Apple", bn: "আপেল" }, slug: "red-apple", priceMin: 650, priceMax: null, originalPrice: 750, imageUrl: u(IMG.apple), soldOut: false, category: "fruit-trees" },
  { id: "p10", name: { en: "Persimmon", bn: "পার্সিমন" }, slug: "persimmon", priceMin: 1500, priceMax: null, imageUrl: u(IMG.apple), soldOut: false, category: "fruit-trees" },
  { id: "p11", name: { en: "Sweet Grape", bn: "মিষ্টি আঙ্গুর" }, slug: "sweet-grape", priceMin: 450, priceMax: null, imageUrl: u(IMG.greenApple), soldOut: false, category: "fruit-trees" },
  { id: "p12", name: { en: "Pear", bn: "নাশপাতি" }, slug: "pear", priceMin: 520, priceMax: null, originalPrice: 600, imageUrl: u(IMG.greenApple), soldOut: false, category: "fruit-trees" },
  { id: "p13", name: { en: "Mango", bn: "আম" }, slug: "mango", priceMin: 300, priceMax: 700, imageUrl: u(IMG.apple), soldOut: false, category: "fruit-trees" },

  // --- Flower Plants ---
  { id: "p1", name: { en: "Cat's Claw Creeper", bn: "ক্যাট'স ক্ল ক্রিপার" }, slug: "cats-claw-creeper", priceMin: 600, priceMax: null, imageUrl: u(IMG.lavender), soldOut: false, category: "flower-plants" },
  { id: "p2", name: { en: "Golden Shower", bn: "সোনালু" }, slug: "golden-shower", priceMin: 500, priceMax: null, imageUrl: u(IMG.lavender), soldOut: false, category: "flower-plants" },
  { id: "p7", name: { en: "Camellia", bn: "ক্যামেলিয়া" }, slug: "camellia", priceMin: 500, priceMax: null, imageUrl: u(IMG.lavender), soldOut: false, category: "flower-plants" },
  { id: "p14", name: { en: "Pink Tecoma", bn: "গোলাপি টিকোমা" }, slug: "pink-tecoma", priceMin: 500, priceMax: null, imageUrl: u(IMG.lavender), soldOut: false, category: "flower-plants" },
  { id: "p15", name: { en: "Oleander", bn: "রক্তকরবী" }, slug: "oleander", priceMin: 300, priceMax: null, imageUrl: u(IMG.lavender), soldOut: false, category: "flower-plants" },
  { id: "p16", name: { en: "Wisteria", bn: "লতাফুল" }, slug: "wisteria", priceMin: 670, priceMax: null, originalPrice: 1000, imageUrl: u(IMG.lavender), soldOut: false, category: "flower-plants" },

  // --- Ornamental Plants ---
  { id: "p6", name: { en: "Erica Palm", bn: "এরিকা পাম" }, slug: "erica-palm", priceMin: 100, priceMax: 185, imageUrl: u(IMG.succulent), soldOut: false, category: "ornamental-plants" },
  { id: "p8", name: { en: "Bougainvillea", bn: "বাগানবিলাস" }, slug: "bougainvillea", priceMin: 250, priceMax: 600, imageUrl: u(IMG.succulent), soldOut: false, category: "ornamental-plants" },
  { id: "p17", name: { en: "Parlour Palm", bn: "পার্লর পাম" }, slug: "parlour-palm", priceMin: 400, priceMax: null, imageUrl: u(IMG.succulent), soldOut: false, category: "ornamental-plants" },
  { id: "p18", name: { en: "Asparagus Fern", bn: "অ্যাসপারাগাস ফার্ন" }, slug: "asparagus-fern", priceMin: 300, priceMax: null, imageUrl: u(IMG.succulent), soldOut: false, category: "ornamental-plants" },
  { id: "p19", name: { en: "Bonsai Ficus", bn: "বনসাই ফাইকাস" }, slug: "bonsai-ficus", priceMin: 800, priceMax: null, originalPrice: 1100, imageUrl: u(IMG.succulent), soldOut: false, category: "ornamental-plants" },
  { id: "p20", name: { en: "Rubber Plant", bn: "রাবার প্ল্যান্ট" }, slug: "rubber-plant", priceMin: 350, priceMax: 500, imageUrl: u(IMG.succulent), soldOut: false, category: "ornamental-plants" },

  // --- Spice Plants ---
  { id: "p21", name: { en: "Rosemary", bn: "রোজমেরি" }, slug: "rosemary", priceMin: 500, priceMax: null, imageUrl: u(IMG.seedlings), soldOut: false, category: "spice-plants" },
  { id: "p22", name: { en: "Bay Leaf", bn: "তেজপাতা গাছ" }, slug: "bay-leaf", priceMin: 350, priceMax: null, imageUrl: u(IMG.seedlings), soldOut: false, category: "spice-plants" },
  { id: "p23", name: { en: "Cinnamon", bn: "দারচিনি গাছ" }, slug: "cinnamon", priceMin: 500, priceMax: null, imageUrl: u(IMG.seedlings), soldOut: false, category: "spice-plants" },
  { id: "p24", name: { en: "Cardamom", bn: "এলাচ গাছ" }, slug: "cardamom", priceMin: 300, priceMax: null, imageUrl: u(IMG.seedlings), soldOut: true, category: "spice-plants" },
  { id: "p25", name: { en: "Clove", bn: "লবঙ্গ গাছ" }, slug: "clove", priceMin: 600, priceMax: null, originalPrice: 800, imageUrl: u(IMG.seedlings), soldOut: false, category: "spice-plants" },

  // --- Medicinal Plants ---
  { id: "p26", name: { en: "Aloe Vera", bn: "অ্যালোভেরা" }, slug: "aloe-vera", priceMin: 150, priceMax: null, imageUrl: u(IMG.succulent), soldOut: false, category: "medicinal-plants" },
  { id: "p27", name: { en: "Tulsi", bn: "তুলসী" }, slug: "tulsi", priceMin: 100, priceMax: null, imageUrl: u(IMG.seedlings), soldOut: false, category: "medicinal-plants" },
  { id: "p28", name: { en: "Neem", bn: "নিম গাছ" }, slug: "neem", priceMin: 200, priceMax: 400, imageUrl: u(IMG.seedlings), soldOut: false, category: "medicinal-plants" },
  { id: "p29", name: { en: "Ashwagandha", bn: "অশ্বগন্ধা" }, slug: "ashwagandha", priceMin: 250, priceMax: null, imageUrl: u(IMG.succulent), soldOut: false, category: "medicinal-plants" },
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
