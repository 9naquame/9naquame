import { getInitialViewCounts } from "@/lib/server/views-db";
import { ViewCounterProvider } from "@/components/portfolio/ViewCounter";
import { ContactProvider } from "@/components/portfolio/Contact";
import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Serve confirmed counts with cached HTML; regenerate snapshots in the background.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Kwame Owusu-Boakye — Engineering Leader & Builder",
  description:
    "Engineering leadership, financial technology, and thoughtful software. Selected projects, experience, and community work by Kwame Owusu-Boakye, based in Newfoundland, Canada.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Kwame Owusu-Boakye — Engineering Leader & Builder",
    description:
      "People, platforms, and the space between. Explore my work in fintech, data, and cloud infrastructure.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const initialCounts = await getInitialViewCounts();
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${jetbrainsMono.variable}`}>
        <ViewCounterProvider initialCounts={initialCounts}>
          <ContactProvider>{children}</ContactProvider>
        </ViewCounterProvider>
      </body>
    </html>
  );
}
