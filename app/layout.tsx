import type { Metadata, Viewport } from "next";
import { Fredoka, Outfit } from "next/font/google";
import "./globals.css";

const display = Fredoka({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Daily Chore Treasure Quest",
  description:
    "Turn everyday chores into a magical adventure. Earn XP, open chests, and gear up!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#b8e4ef",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-sky-1 text-ink">
        {children}
      </body>
    </html>
  );
}
