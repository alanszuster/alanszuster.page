import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Sora({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Alan Szuster - Portfolio",
  description:
    "Professional portfolio of Alan Szuster - Site Reliability Engineer",
  icons: {
    icon: "/custom-logo-as.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAnalyticsEnabled =
    process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === "true";

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className={`${bodyFont.variable} ${displayFont.variable}`}>
        {children}
        {isAnalyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
