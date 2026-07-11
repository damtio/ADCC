import { OrientationNav } from "@/components/OrientationNav";
import { OrientationSectionView } from "@/components/OrientationSection";
import { highlightTag } from "@/lib/i18n-rich";
import type { OrientationSection } from "@/types/orientation";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("orientation");

  return {
    title: t("title").replace(/<[^>]+>/g, ""),
    description: t("subtitle"),
  };
}

export default async function KrakowOrientationPage() {
  const t = await getTranslations("orientation");
  const sections = t.raw("sections") as OrientationSection[];
  const navSections = sections.map(({ id, title }) => ({ id, title }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center lg:mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          {t.rich("title", highlightTag)}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-zinc-400">{t("subtitle")}</p>
      </div>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        <OrientationNav
          sections={navSections}
          onThisPageLabel={t("onThisPage")}
        />

        <div className="min-w-0 flex-1 space-y-12">
          {sections.map((section) => (
            <OrientationSectionView
              key={section.id}
              id={section.id}
              title={section.title}
              blocks={section.blocks}
              tipLabel={t("tipLabel")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
