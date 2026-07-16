import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Manrope, Playfair_Display, Cormorant_Garamond } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"]
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"]
});

const gloria = localFont({
  src: "./fonts/gloriascript.ttf",
  variable: "--font-gloria",
  display: "swap",
});

const garamond = localFont({
  src: [
    {
      path: "./fonts/Garamond - Garamond - Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Garamond-Italic - Garamond - Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Garamond-Bold - Garamond - Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Garamond-BoldItalic-04.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-garamond",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Данис и Инесса | Приглашение на никах",
  description: "Онлайн-приглашение на никах Данис & Инесса, 08.08.2026."
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "auto"
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru" className={`${gloria.variable} ${cormorant.variable} ${playfair.variable} ${garamond.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
