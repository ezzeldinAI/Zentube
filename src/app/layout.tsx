import type { Metadata } from "next";

import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/trpc/client";

import "./globals.css";

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
            <NuqsAdapter>

              {children}
            </NuqsAdapter>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
