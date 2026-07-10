import Link from "next/link";
import { redirect } from "next/navigation";
import { createAcademyAction } from "@/app/admin/actions";
import { AcademyForm } from "@/components/AcademyForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewAcademyPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin/academies"
        className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
      >
        &larr; Back to academies
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Add New Academy</h1>
      <AcademyForm action={createAcademyAction} />
    </div>
  );
}
