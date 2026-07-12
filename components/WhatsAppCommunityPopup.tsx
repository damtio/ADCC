"use client";

import { MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  WHATSAPP_COMMUNITY_URL,
  WHATSAPP_POPUP_STORAGE_KEY,
} from "@/lib/whatsapp-community";
import { cn } from "@/lib/utils";

export function WhatsAppCommunityPopup() {
  const t = useTranslations("whatsappPopup");
  const [open, setOpen] = useState(false);
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(WHATSAPP_POPUP_STORAGE_KEY);
    if (dismissed) {
      setShowFab(true);
      return;
    }

    const timer = window.setTimeout(() => setOpen(true), 1500);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    localStorage.setItem(WHATSAPP_POPUP_STORAGE_KEY, "1");
    setOpen(false);
    setShowFab(true);
  }

  function reopen() {
    setOpen(true);
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-popup-title"
        >
          <div className="relative w-full max-w-md rounded-xl border border-[#2B2B2B] bg-[#111] p-6 shadow-2xl shadow-red-900/10">
            <button
              type="button"
              onClick={dismiss}
              className="absolute top-4 right-4 rounded-lg p-1 text-zinc-500 transition-colors hover:bg-[#1a1a1a] hover:text-white"
              aria-label={t("close")}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-green-500" />
              <h2
                id="whatsapp-popup-title"
                className="text-xl font-bold text-white"
              >
                {t("title")}
              </h2>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-zinc-400">
              {t("description")}
            </p>

            <div className="mx-auto mb-6 flex w-fit rounded-xl bg-white p-4">
              <QRCode
                value={WHATSAPP_COMMUNITY_URL}
                size={180}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>

            <p className="mb-4 text-center text-xs text-zinc-500">
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
          onClick={reopen}
          className={cn(
            "fixed right-4 bottom-4 z-[90] flex h-14 w-14 items-center justify-center rounded-full",
            "bg-green-600 text-white shadow-lg shadow-green-900/30 transition-transform hover:scale-105 hover:bg-green-500",
          )}
          aria-label={t("reopen")}
        >
          <MessageCircle className="h-7 w-7" />
        </button>
      )}
    </>
  );
}
