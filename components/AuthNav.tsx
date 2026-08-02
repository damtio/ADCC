"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { isSupabasePublicConfigured } from "@/lib/supabase";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
interface AuthNavProps {
  linkClassName?: string;
  onNavigate?: () => void;
}

export function AuthNav({ linkClassName, onNavigate }: AuthNavProps) {
  const t = useTranslations("nav");
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabasePublicConfigured()) {
      setReady(true);
      return;
    }

    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    if (!isSupabasePublicConfigured()) return;
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setEmail(null);
    onNavigate?.();
    router.push("/login");
    router.refresh();
  }

  if (!ready) {
    return <span className="h-8 w-16" aria-hidden />;
  }

  if (email) {
    return (
      <>
        <Link href="/my-events" className={linkClassName} onClick={onNavigate}>
          {t("myEvents")}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-white"
          onClick={handleSignOut}
        >
          {t("logout")}
        </Button>
      </>
    );
  }

  return (
    <Link
      href="/login"
      className={cn(linkClassName, "text-red-400 hover:text-red-300")}
      onClick={onNavigate}
    >
      {t("login")}
    </Link>
  );
}
