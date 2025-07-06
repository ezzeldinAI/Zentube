import type { Metadata } from "next";

import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "zentube/ui/sonner";

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
    <html lang="en">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <NuqsAdapter>
          <ClerkProvider>
            <TRPCProvider>
              {children}
              <Toaster />
            </TRPCProvider>
          </ClerkProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
