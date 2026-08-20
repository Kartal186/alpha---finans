import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alpha Finans - Canlı Kripto, Borsa & Kozmik Enerji Terminali",
  description: "Türkiye, Avrupa ve Asya piyasalarını kapsayan, uzay-zaman boyutlarından gelen canlı enerji akışına sahip anlık finans takip ve AI gösterge terminali.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="bg-slate-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
