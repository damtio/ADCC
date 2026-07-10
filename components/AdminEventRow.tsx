"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteEventAction, togglePublishAction } from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types/event";
import { formatDate } from "@/lib/utils";

interface AdminEventRowProps {
  event: Event;
}

export function AdminEventRow({ event }: AdminEventRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${event.title}"?`)) return;
    startTransition(() => deleteEventAction(event.id));
  }

  function handleTogglePublish() {
    startTransition(() => togglePublishAction(event.id, !event.published));
  }

  return (
    <tr className="border-b border-[#2B2B2B] hover:bg-[#111]">
      <td className="px-4 py-3 text-sm font-medium">{event.title}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{event.category}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">
        {formatDate(event.date)}
      </td>
      <td className="px-4 py-3">
        <Badge variant={event.published ? "default" : "secondary"}>
          {event.published ? "Published" : "Draft"}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePublish}
            disabled={isPending}
            title={event.published ? "Unpublish" : "Publish"}
          >
            {event.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/edit/${event.id}`}>
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </td>
    </tr>
  );
}
