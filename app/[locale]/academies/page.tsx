import { AcademyCard } from "@/components/AcademyCard";
import { highlightTag } from "@/lib/i18n-rich";
import { getPublishedAcademies } from "@/lib/supabase";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const t = await getTranslations("academies");

  return {
    title: t("title").replace(/<[^>]+>/g, ""),
    description: t("subtitle"),
  };
}

export default async function AcademiesPage() {
  const t = await getTranslations("academies");
  const academies = await getPublishedAcademies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {t.rich("title", highlightTag)}
        </h1>
        <p className="mt-3 text-zinc-400">{t("subtitle")}</p>
      </div>

      {academies.length === 0 ? (
        <p className="text-center text-zinc-500">{t("empty")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {academies.map((academy) => (
            <AcademyCard key={academy.id} academy={academy} />
          ))}
        </div>
      )}
    </div>
  );
}
