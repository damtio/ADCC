import { getTranslations, setRequestLocale } from "next-intl/server";
import { getUserAcademies } from "@/app/[locale]/my-academies/actions";
import { UserAcademyRow } from "@/components/UserAcademyRow";
import { Button } from "@/components/ui/button";
import { Link, redirect } from "@/i18n/navigation";
import { getAuthUser } from "@/lib/supabase/server";

interface MyAcademiesPageProps {
  params: Promise<{ locale: string }>;
}

export default async function MyAcademiesPage({
  params,
}: MyAcademiesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const user = await getAuthUser();
  if (!user) redirect({ href: "/login", locale });

  const t = await getTranslations("myAcademies");
  const academies = await getUserAcademies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">{t("subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/my-academies/new">{t("addAcademy")}</Link>
        </Button>
      </div>

      {academies.length === 0 ? (
        <div className="rounded-xl border border-[#2B2B2B] bg-[#151515] px-6 py-12 text-center">
          <p className="text-zinc-400">{t("empty")}</p>
          <Button asChild className="mt-4">
            <Link href="/my-academies/new">{t("addAcademy")}</Link>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#2B2B2B]">
          <table className="w-full min-w-[640px]">
            <thead className="border-b border-[#2B2B2B] bg-[#111]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  {t("colName")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  {t("colCity")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  {t("colSpecialization")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  {t("colStatus")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                  {t("colActions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {academies.map((academy) => (
                <UserAcademyRow key={academy.id} academy={academy} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
