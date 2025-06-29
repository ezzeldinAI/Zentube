import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZenTube",
  description: "platform for watching videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "w-[100vw] h-[100vh] flex items-center justify-center",
          inter.className
        )}
      >
        {children}
      </body>
    </html>
  );
}
