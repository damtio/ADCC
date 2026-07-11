import { SubmissionForm } from "@/components/SubmissionForm";
import { submitEventAction } from "@/app/submit-event/actions";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("submitEvent");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default async function SubmitEventPage() {
  const t = await getTranslations("submitEvent");

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
        <p className="mt-2 text-zinc-400">{t("subtitle")}</p>
      </div>
      <SubmissionForm action={submitEventAction} />
    </div>
  );
}
