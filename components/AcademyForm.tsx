"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter as useIntlRouter } from "@/i18n/navigation";
import { ACADEMY_SPECIALIZATIONS, type Academy } from "@/types/academy";

type FormAction = (
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData,
) => Promise<{ error?: string; success?: boolean } | null>;

interface AcademyFormProps {
  academy?: Academy;
  action: FormAction;
  successHref?: string;
  showAdminFields?: boolean;
}

export function AcademyForm({
  academy,
  action,
  successHref = "/admin/academies",
  showAdminFields = true,
}: AcademyFormProps) {
  const nextRouter = useNextRouter();
  const intlRouter = useIntlRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (!state?.success) return;
    if (successHref.startsWith("/admin")) {
      nextRouter.push(successHref);
      nextRouter.refresh();
    } else {
      intlRouter.push(successHref);
      intlRouter.refresh();
    }
  }, [state?.success, nextRouter, intlRouter, successHref]);

  return (
    <form action={formAction} className="space-y-6">
      {academy && <input type="hidden" name="id" value={academy.id} />}

      {state?.error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" name="name" defaultValue={academy?.name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            defaultValue={academy?.city ?? "Kraków"}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specialization">Specialization *</Label>
          <select
            id="specialization"
            name="specialization"
            defaultValue={academy?.specialization || "Gi + NoGi"}
            required
            className="flex h-10 w-full rounded-lg border border-[#2B2B2B] bg-[#151515] px-3 py-2 text-sm text-white focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
          >
            {ACADEMY_SPECIALIZATIONS.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="district">District</Label>
          <Input
            id="district"
            name="district"
            defaultValue={academy?.district ?? ""}
          />
        </div>

        {showAdminFields && (
          <div className="space-y-2">
            <Label htmlFor="sort_order">Sort order</Label>
            <Input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={academy?.sort_order ?? 0}
            />
          </div>
        )}

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            defaultValue={academy?.address}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" defaultValue={academy?.phone ?? ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={academy?.email ?? ""}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://"
            defaultValue={academy?.website ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            name="latitude"
            type="number"
            step="any"
            defaultValue={academy?.latitude ?? ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            name="longitude"
            type="number"
            step="any"
            defaultValue={academy?.longitude ?? ""}
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            defaultChecked={academy?.published ?? true}
            className="h-4 w-4 rounded border-[#2B2B2B] bg-[#151515] text-red-600 focus:ring-red-500"
          />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : academy
              ? "Update Academy"
              : "Create Academy"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => nextRouter.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
