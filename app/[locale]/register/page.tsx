import { setRequestLocale } from "next-intl/server";
import { AuthForm } from "@/components/AuthForm";
import { getAuthUser } from "@/lib/supabase/server";
import { redirect } from "@/i18n/navigation";
import { NO_INDEX_METADATA } from "@/lib/seo";

export const metadata = NO_INDEX_METADATA;

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RegisterPage({ params }: RegisterPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getAuthUser();
  if (user) redirect({ href: "/my-events", locale });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AuthForm mode="register" />
    </div>
  );
}
