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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.alanszuster.dev";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alan Szuster",
  jobTitle: "Site Reliability Engineer",
  url: siteUrl,
  image: `${siteUrl}/alan.jpg`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Szczecin",
    addressCountry: "PL",
  },
  sameAs: [
    "https://github.com/alanszuster",
    "https://linkedin.com/in/alan-szuster",
  ],
  knowsAbout: [
    "Kubernetes",
    "Google Cloud Platform",
    "Microsoft Azure",
    "Terraform",
    "Site Reliability Engineering",
    "Agentic AI",
    "Machine Learning",
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: "Alan Szuster",
    title: "Alan Szuster - Site Reliability Engineer",
    description:
      "Site Reliability Engineer and Dev / AI Engineer: production Kubernetes on GKE and AKS, GCP and Azure, Terraform, and AI agents.",
  },
  twitter: { card: "summary_large_image" },
  title: "Alan Szuster - Site Reliability Engineer",
  description:
    "Alan Szuster, Site Reliability Engineer and Dev / AI Engineer. Production Kubernetes on GKE and AKS, GCP and Azure networking, Terraform, and AI agents/ML workloads.",
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        {isAnalyticsEnabled ? <Analytics /> : null}
      </body>
    </html>
  );
}
