"use client";

import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import {
  deleteAcademyAction,
  toggleAcademyPublishAction,
} from "@/app/admin/actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Academy } from "@/types/academy";

interface AdminAcademyRowProps {
  academy: Academy;
}

export function AdminAcademyRow({ academy }: AdminAcademyRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${academy.name}"?`)) return;
    startTransition(() => deleteAcademyAction(academy.id));
  }

  function handleTogglePublish() {
    startTransition(() =>
      toggleAcademyPublishAction(academy.id, !academy.published),
    );
  }

  return (
    <tr className="border-b border-[#2B2B2B] hover:bg-[#111]">
      <td className="px-4 py-3 text-sm font-medium">{academy.name}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{academy.district}</td>
      <td className="px-4 py-3 text-sm text-zinc-400">{academy.sort_order}</td>
      <td className="px-4 py-3">
        <Badge variant={academy.published ? "default" : "secondary"}>
          {academy.published ? "Published" : "Draft"}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePublish}
            disabled={isPending}
            title={academy.published ? "Unpublish" : "Publish"}
          >
            {academy.published ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/admin/academies/edit/${academy.id}`}>
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
