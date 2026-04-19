import React from "react";
import { Metadata } from "next";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";
import client from "@/tina/__generated__/client";
import { FilterProvider } from "@/components/layout/filter-context";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Bambala Studio",
  description: "Bambala Studio. Creación audiovisual en Barcelona.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let globalData;
  try {
    const result = await client.queries.global({
      relativePath: "index.json",
    });
    globalData = result.data;
  } catch (error) {
    console.warn("Failed to fetch global data, using defaults:", error);
    globalData = {
      global: {
        theme: {
          darkMode: "light"
        }
      }
    };
  }

  const isDark = globalData.global.theme?.darkMode === "dark";

  return (
    <html lang="en" className={cn(fontSans.variable, nunito.variable, lato.variable, isDark && "dark")}>
      <body className="relative min-h-screen bg-background font-sans antialiased">
        <div className="relative z-10">
          <FilterProvider>
            <VideoDialogProvider>
              {children}
              <VideoDialog />
            </VideoDialogProvider>
          </FilterProvider>
          <TailwindIndicator />
        </div>
      </body>
    </html>
  );
}
