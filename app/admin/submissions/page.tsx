import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllSubmissionsAdmin, logoutAction } from "@/app/admin/actions";
import { AdminSubmissionRow } from "@/components/AdminSubmissionRow";
import { Button } from "@/components/ui/button";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  const submissions = await getAllSubmissionsAdmin();
  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/admin"
            className="mb-2 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
          >
            &larr; Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Event Submissions</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {pendingCount} pending · {submissions.length} total
          </p>
        </div>
        <form action={logoutAction}>
          <Button type="submit" variant="outline">
            Logout
          </Button>
        </form>
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
                Contact
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
            {submissions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-zinc-500"
                >
                  No submissions yet.
                </td>
              </tr>
            ) : (
              submissions.map((submission) => (
                <AdminSubmissionRow
                  key={submission.id}
                  submission={submission}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
