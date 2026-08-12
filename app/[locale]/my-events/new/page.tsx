import { getTranslations, setRequestLocale } from "next-intl/server";
import { createUserEventAction } from "@/app/[locale]/my-events/actions";
import { EventForm } from "@/components/EventForm";
import { Link, redirect } from "@/i18n/navigation";
import { getAuthUser } from "@/lib/supabase/server";

interface NewUserEventPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewUserEventPage({
  params,
}: NewUserEventPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getAuthUser();
  if (!user) redirect({ href: "/login", locale });

  const t = await getTranslations("myEvents");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/my-events"
        className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
      >
        &larr; {t("back")}
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">{t("createTitle")}</h1>
      <EventForm
        action={createUserEventAction}
        successHref="/my-events"
        translated
      />
    </div>
  );
}
