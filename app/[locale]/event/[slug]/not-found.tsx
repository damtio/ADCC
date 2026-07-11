import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export default async function EventNotFound() {
  const t = await getTranslations("eventPage");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="mt-4 text-xl text-zinc-400">{t("notFound")}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t("backToEvents")}</Link>
      </Button>
    </div>
  );
}
