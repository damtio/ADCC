import Link from "next/link";
import { redirect } from "next/navigation";
import { createEventAction } from "@/app/admin/actions";
import { EventForm } from "@/components/EventForm";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  if (!(await isAuthenticated())) redirect("/admin");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
      >
        &larr; Back to dashboard
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Add New Event</h1>
      <EventForm action={createEventAction} />
    </div>
  );
}
