import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getEventByIdAdmin, updateEventAction } from "@/app/admin/actions";
import { EventForm } from "@/components/EventForm";
import { isAuthenticated } from "@/lib/auth";
import type { Event } from "@/types/event";

export const dynamic = "force-dynamic";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  if (!(await isAuthenticated())) redirect("/admin");

  const { id } = await params;
  const event = await getEventByIdAdmin(id);

  if (!event) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/admin"
        className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-red-500"
      >
        &larr; Back to dashboard
      </Link>
      <h1 className="mb-8 text-2xl font-bold text-white">Edit Event</h1>
      <EventForm event={event as Event} action={updateEventAction} />
    </div>
  );
}
