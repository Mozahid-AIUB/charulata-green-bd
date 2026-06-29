"use client";

import { useTranslations } from "next-intl";
import { Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";

export function TrustBar() {
  const t = useTranslations("trust");

  const items = [
    { Icon: Truck, title: t("freeGiftTitle"), text: t("freeGiftText") },
    { Icon: ShieldCheck, title: t("secureTitle"), text: t("secureText") },
    { Icon: Headphones, title: t("supportTitle"), text: t("supportText") },
    { Icon: RotateCcw, title: t("resendTitle"), text: t("resendText") },
  ];

  return (
    <div className="bg-brand-600 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <Icon className="h-9 w-9 flex-shrink-0 text-white/90" strokeWidth={1.5} />
            <div>
              <p className="font-semibold leading-tight">{title}</p>
              <p className="text-sm text-white/80">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
