import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@/features/analytics/GoogleAnalytics";
import { buildGoogleSiteVerification } from "@/core/seo/search-console";
import { siteConfig } from "@/core/seo/site-config";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#007AFF",
};

export const metadata: Metadata = {
  title: {
    default: "AI Roth Conversion Calculator 2026 | Estimate Taxes & Break-Even",
    template: "%s | Roth Conversion Calculator",
  },
  description:
    "Free AI Roth conversion calculator for 2026. Estimate federal tax, state tax, potential penalties, break-even years, and get plain-English AI explanations.",
  metadataBase: new URL(siteConfig.siteUrl),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "RothCalc",
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Roth Conversion Calculator 2026",
    description:
      "Estimate Roth conversion taxes, potential penalties, break-even years, and use AI to understand the result.",
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    type: "website",
    images: [
      {
        url: "/social-preview.svg",
        width: 1200,
        height: 630,
        alt: "Roth Conversion Calculator 2026 educational tax estimate tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Roth Conversion Calculator 2026",
    description:
      "Estimate Roth conversion taxes, potential penalties, break-even years, and use AI to understand the result.",
    images: ["/social-preview.svg"],
  },
  verification: buildGoogleSiteVerification(),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('roth-conversion-calculator:theme:v1');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
        <GoogleAnalytics />
      </head>
      <body>
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-systemBlue focus:px-4 focus:py-2 focus:text-white"
          href="#calculator"
        >
          Skip to calculator
        </a>
        {children}
      </body>
    </html>
  );
}
