import type { Metadata } from "next";
import { SubmissionForm } from "@/components/SubmissionForm";
import { submitEventAction } from "@/app/submit-event/actions";

export const metadata: Metadata = {
  title: "Submit Event",
  description: "Submit your BJJ seminar or event for ADCC 2026 Kraków.",
};

export default function SubmitEventPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Submit an Event</h1>
        <p className="mt-2 text-zinc-400">
          Propose a seminar, open mat or afterparty for ADCC 2026 weekend.
          Submissions are reviewed before publishing.
        </p>
      </div>
      <SubmissionForm action={submitEventAction} />
    </div>
  );
}
