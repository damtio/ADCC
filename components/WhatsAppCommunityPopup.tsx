"use client";

import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  isWhatsAppPopupCoolingDown,
  isWhatsAppPopupExcludedPath,
  reachedWhatsAppScrollThreshold,
  WHATSAPP_COMMUNITY_URL,
  WHATSAPP_POPUP_DELAY_MS,
  WHATSAPP_POPUP_STORAGE_KEY,
} from "@/lib/whatsapp-community";
import { cn } from "@/lib/utils";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function WhatsAppCommunityPopup() {
  const t = useTranslations("whatsappPopup");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const excluded = isWhatsAppPopupExcludedPath(pathname);

  useEffect(() => {
    if (excluded) return;

    let storedValue = localStorage.getItem(WHATSAPP_POPUP_STORAGE_KEY);
    if (storedValue === "1") {
      storedValue = String(Date.now());
      localStorage.setItem(WHATSAPP_POPUP_STORAGE_KEY, storedValue);
    }

    if (isWhatsAppPopupCoolingDown(storedValue)) {
      setShowFab(true);
      return;
    }

    let triggered = false;
    function trigger() {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }

    function onScroll() {
      if (
        reachedWhatsAppScrollThreshold(
          window.scrollY,
          window.innerHeight,
          document.documentElement.scrollHeight,
        )
      ) {
        trigger();
      }
    }

    const timer = window.setTimeout(trigger, WHATSAPP_POPUP_DELAY_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [excluded]);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusable = () =>
      Array.from(
        dialog?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      );

    window.requestAnimationFrame(() => focusable()[0]?.focus());

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusable();
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [open]);

  function dismiss() {
    localStorage.setItem(WHATSAPP_POPUP_STORAGE_KEY, String(Date.now()));
    setOpen(false);
    setShowFab(true);
  }

  if (excluded) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            ref={dialogRef}
            className="relative max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-[#2B2B2B] bg-[#111] p-6 shadow-2xl shadow-red-900/10"
            role="dialog"
            aria-modal="true"
            aria-labelledby="whatsapp-popup-title"
            aria-describedby="whatsapp-popup-description"
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-4 right-4 rounded-lg p-1 text-zinc-500 transition-colors hover:bg-[#1a1a1a] hover:text-white"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-2 pr-8">
              <MessageCircle className="h-6 w-6 text-green-500" />
              <h2
                id="whatsapp-popup-title"
                className="text-xl font-bold text-white"
              >
                {t("title")}
              </h2>
            </div>

            <p
              id="whatsapp-popup-description"
              className="mb-6 text-sm leading-relaxed text-zinc-400"
            >
              {t("description")}
            </p>

            <div className="mx-auto mb-6 hidden w-fit rounded-xl bg-white p-4 sm:flex">
              <QRCode
                value={WHATSAPP_COMMUNITY_URL}
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <p className="mb-4 hidden text-center text-xs text-zinc-500 sm:block">
              {t("scanHint")}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                asChild
                className="flex-1 bg-green-600 hover:bg-green-500"
              >
                <a
                  href={WHATSAPP_COMMUNITY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                >
                  {t("joinButton")}
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={dismiss}
              >
                {t("laterButton")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {!open && showFab && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "fixed right-4 bottom-4 z-[90] flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14",
            "bg-green-600 text-white shadow-lg shadow-green-900/30 transition-transform hover:scale-105 hover:bg-green-500",
          )}
          aria-label={t("reopen")}
        >
          <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
        </button>
      )}
    </>
  );
}
