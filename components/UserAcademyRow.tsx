"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import {
  deleteUserAcademyAction,
  toggleUserAcademyPublishAction,
} from "@/app/[locale]/my-academies/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Academy } from "@/types/academy";

interface UserAcademyRowProps {
  academy: Academy;
}

export function UserAcademyRow({ academy }: UserAcademyRowProps) {
  const t = useTranslations("myAcademies");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(t("deleteConfirm", { name: academy.name }))) return;
    startTransition(() => deleteUserAcademyAction(academy.id));
  }

  function handleTogglePublish() {
    startTransition(() =>
      toggleUserAcademyPublishAction(academy.id, !academy.published),
    );
  }

  return (
    <tr className="border-b border-[#2B2B2B] hover:bg-[#111]">
      <td className="px-4 py-3 text-sm font-medium">{academy.name}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{academy.city}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">
        {academy.specialization}
      </td>
      <td className="px-4 py-3">
        <Badge variant={academy.published ? "default" : "secondary"}>
          {academy.published ? t("published") : t("draft")}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePublish}
            disabled={isPending}
            title={academy.published ? t("unpublish") : t("publish")}
          >
            {academy.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/my-academies/edit/${academy.id}`}>
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
