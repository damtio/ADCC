"use client";

import { Check, X } from "lucide-react";
import { useTransition } from "react";
import {
  approveSubmissionAction,
  rejectSubmissionAction,
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EventSubmission } from "@/types/submission";
import { formatDate } from "@/lib/utils";

interface AdminSubmissionRowProps {
  submission: EventSubmission;
}

export function AdminSubmissionRow({ submission }: AdminSubmissionRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(() => approveSubmissionAction(submission.id));
  }

  function handleReject() {
    if (!confirm(`Reject "${submission.title}"?`)) return;
    startTransition(() => rejectSubmissionAction(submission.id));
  }

  return (
    <tr className="border-b border-[#2B2B2B] hover:bg-[#111]">
      <td className="px-4 py-3 text-sm font-medium">{submission.title}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{submission.category}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">
        {formatDate(submission.date)}
      </td>
      <td className="px-4 py-3 text-sm text-zinc-400">
        {submission.contact_email}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={
            submission.status === "pending"
              ? "default"
              : submission.status === "approved"
                ? "secondary"
                : "outline"
          }
        >
          {submission.status}
        </Badge>
      </td>
      <td className="px-4 py-3">
        {submission.status === "pending" && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleApprove}
              disabled={isPending}
              title="Approve"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReject}
              disabled={isPending}
              title="Reject"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </td>
    </tr>
  );
}
