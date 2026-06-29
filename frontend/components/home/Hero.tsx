import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-brand-50">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
          Country&apos;s largest online nursery
        </p>
        <h1 className="text-4xl font-bold text-brand-900 sm:text-5xl">
          Buy green to save green
        </h1>
        <p className="max-w-2xl text-brand-700">
          Fruit trees, flowers, ornamentals, and everything your garden needs —
          delivered to your door.
        </p>
        <Link
          href="/shop"
          className="rounded bg-brand-600 px-6 py-3 font-medium text-white transition hover:bg-brand-700"
        >
          Shop now
        </Link>
      </div>
    </section>
  );
}
