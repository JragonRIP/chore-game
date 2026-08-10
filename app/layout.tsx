import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Nunito } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const body = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Daily Chore Treasure Quest",
  description:
    "Turn everyday chores into an 8-bit fantasy adventure. Earn XP, open chests, and gear up!",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0b1220",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pixel.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-navy text-cyan-50">
        {children}
      </body>
    </html>
  );
}
