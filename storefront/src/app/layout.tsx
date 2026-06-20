import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

import GlobalCanvas from "@/components/3d/GlobalCanvas";
import Header from "@/components/layout/Header";
import AppShell from "@/components/layout/AppShell";
import CustomCursor from "@/components/ui/CustomCursor";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CHURROVERSE — Space-Themed Gourmet Churros",
    template: "%s | CHURROVERSE",
  },
  description:
    "Explore the Churroverse — an immersive, space-themed gourmet churro experience. Flavor-infused, galaxy-crafted, delivered to your galaxy.",
  keywords: ["churros", "gourmet", "space", "food", "dessert", "online shop"],
  openGraph: {
    title: "CHURROVERSE",
    description: "Where Every Bite Powers A Galaxy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${outfit.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body
          className="min-h-full flex flex-col bg-[#020010] text-white overflow-x-hidden"
          suppressHydrationWarning
        >
          <CustomCursor />
          <GlobalCanvas />
          <AppShell>
            <Header />
            <main className="flex-1 relative z-10 w-full mt-20">{children}</main>
          </AppShell>
        </body>
      </html>
    </ClerkProvider>
  );
}
