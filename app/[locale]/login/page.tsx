import { getTranslations, setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/AuthForm";
import { getAuthUser } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getAuthUser();
  if (user) redirect({ href: "/my-events", locale });

  const t = await getTranslations("auth");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm mode="login" />
      <p className="sr-only">{t("loginTitle")}</p>
    </div>
  );
}
