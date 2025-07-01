import type { Metadata } from "next";

import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/trpc/client";

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
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body
          className={cn(
            "",
            inter.className,
          )}
        >
          <TRPCProvider>
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
