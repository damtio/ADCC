import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  getUserEventById,
  updateUserEventAction,
} from "@/app/[locale]/my-events/actions";
import { EventForm } from "@/components/EventForm";
import { Link, redirect } from "@/i18n/navigation";
import { getAuthUser } from "@/lib/supabase/server";

interface EditUserEventPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditUserEventPage({
  params,
}: EditUserEventPageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const user = await getAuthUser();
  if (!user) redirect({ href: "/login", locale });

  const event = await getUserEventById(id);
  if (!event) notFound();

  const t = await getTranslations("myEvents");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/my-events"
        className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
      >
        &larr; {t("back")}
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">{t("editTitle")}</h1>
      <EventForm
        event={event}
        action={updateUserEventAction}
        successHref="/my-events"
        translated
      />
    </div>
  );
}
