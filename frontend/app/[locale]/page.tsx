import { setRequestLocale, getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold text-brand-900">{t("tagline")}</h1>
    </main>
  );
}
