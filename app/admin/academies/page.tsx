import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllAcademiesAdmin, logoutAction } from "@/app/admin/actions";
import { AdminAcademyRow } from "@/components/AdminAcademyRow";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function AdminAcademiesPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  const academies = await getAllAcademiesAdmin();
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!supabaseReady && (
        <div className="mb-6 rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          Supabase is not configured yet. Add your project credentials to{" "}
          <code className="text-amber-100">.env.local</code> to manage
          academies.
        </div>
      )}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin"
            className="mb-2 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
          >
            &larr; Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Academies</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage BJJ academies ({academies.length})
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/admin/academies/new">Add Academy</Link>
          </Button>
          <form action={logoutAction}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#2B2B2B]">
        <table className="w-full">
          <thead className="bg-[#111]">
            <tr className="border-b border-[#2B2B2B]">
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                District
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Order
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {academies.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-zinc-500"
                >
                  No academies yet.{" "}
                  <Link
                    href="/admin/academies/new"
                    className="text-red-500 hover:underline"
                  >
                    Add your first academy
                  </Link>
                </td>
              </tr>
            ) : (
              academies.map((academy) => (
                <AdminAcademyRow key={academy.id} academy={academy} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
