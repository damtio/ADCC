import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-auto border-t border-[#2B2B2B] bg-[#090909]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} {t("copyright")}
          </p>
          <p className="text-xs text-zinc-600">{t("tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
