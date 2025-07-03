import type { Metadata } from "next";

import {
  ClerkProvider,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";

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
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body
          className={cn(
            "",
            inter.className,
          )}
        >
          <TRPCProvider>
            <Toaster />
            {children}
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
