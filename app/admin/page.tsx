import Link from "next/link";
import {
  getAllEventsAdmin,
  getPendingSubmissionsCount,
  logoutAction,
} from "@/app/admin/actions";
import { AdminEventRow } from "@/components/AdminEventRow";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Enter your password to manage events.
          </p>
          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </div>
      </div>
    );
  }

  const events = await getAllEventsAdmin();
  const pendingSubmissions = await getPendingSubmissionsCount();
  const supabaseReady = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {!supabaseReady && (
        <div className="mb-6 rounded-lg border border-amber-800/50 bg-amber-950/30 px-4 py-3 text-sm text-amber-200">
          Supabase is not configured yet. Add your project credentials to{" "}
          <code className="text-amber-100">.env.local</code> to manage events.
        </div>
      )}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage BJJ events ({events.length})
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/submissions">
              Submissions
              {pendingSubmissions > 0 && (
                <span className="ml-1.5 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white">
                  {pendingSubmissions}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/new">Add Event</Link>
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
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-zinc-500 uppercase">
                Date
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
            {events.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-12 text-center text-zinc-500"
                >
                  No events yet.{" "}
                  <Link
                    href="/admin/new"
                    className="text-red-500 hover:underline"
                  >
                    Create your first event
                  </Link>
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <AdminEventRow key={event.id} event={event} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
