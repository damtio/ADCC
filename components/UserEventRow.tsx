"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  deleteUserEventAction,
  toggleUserPublishAction,
} from "@/app/[locale]/my-events/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Event } from "@/types/event";
import { formatDate } from "@/lib/utils";

interface UserEventRowProps {
  event: Event;
}

export function UserEventRow({ event }: UserEventRowProps) {
  const t = useTranslations("myEvents");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(t("deleteConfirm", { title: event.title }))) return;
    startTransition(() => deleteUserEventAction(event.id));
  }

  function handleTogglePublish() {
    startTransition(() => toggleUserPublishAction(event.id, !event.published));
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
          {event.published ? t("published") : t("draft")}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePublish}
            disabled={isPending}
            title={event.published ? t("unpublish") : t("publish")}
          >
            {event.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/my-events/edit/${event.id}`}>
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
