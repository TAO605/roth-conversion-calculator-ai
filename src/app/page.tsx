import Link from "next/link";
import { HomeCalculatorClient } from "@/app/HomeCalculatorClient";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { isFeatureEnabled } from "@/core/features/feature-registry";
import {
  calculatorHowToJsonLd,
  homepageWebPageJsonLd,
  organizationJsonLd,
  webApplicationJsonLd,
  websiteJsonLd,
} from "@/core/seo/json-ld";
import { ThemeToggle } from "@/features/theme-toggle/ThemeToggle";

export default function HomePage() {
  return (
    <main className="mx-auto grid w-full max-w-7xl gap-5 overflow-x-clip px-4 py-4 sm:px-6 lg:px-8">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationJsonLd()) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd()) }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebPageJsonLd()) }}
        type="application/ld+json"
      />
      {isFeatureEnabled("homepage-howto-structured-data") ? (
        <>
          <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorHowToJsonLd()) }}
            type="application/ld+json"
          />
          <script
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            type="application/ld+json"
          />
        </>
      ) : null}
      <header className="grid w-full min-w-0 max-w-full gap-4 pt-2">
        <nav
          aria-label="Primary navigation"
          className="flex w-full min-w-0 flex-col items-start justify-between gap-3 rounded border border-neutral-200 bg-white px-4 py-3 text-sm shadow-none dark:border-white/10 dark:bg-neutral-950 sm:flex-row sm:items-center"
        >
          <Link className="shrink-0 font-semibold text-neutral-950 dark:text-white" href="/">
            RothCalc
          </Link>
          <div className="flex w-full min-w-0 flex-none flex-wrap items-center justify-start gap-3 text-neutral-600 dark:text-neutral-300 sm:w-auto sm:flex-1 sm:justify-end">
            {isFeatureEnabled("theme-toggle") ? <ThemeToggle /> : null}
          </div>
        </nav>
        <h1 className="text-2xl font-bold tracking-normal text-neutral-950 dark:text-white sm:text-3xl">
          Roth Conversion Calculator 2026
        </h1>
        <p className="text-xs font-medium leading-5 text-neutral-500 dark:text-neutral-400">
          Educational estimate. Tax professional review pending.
        </p>
      </header>

      <HomeCalculatorClient />

      <footer
        aria-label="Footer navigation and disclaimer"
        className="w-full min-w-0 border-t border-neutral-200 py-6 text-xs leading-5 text-neutral-500 dark:border-white/10 dark:text-neutral-400"
      >
        <div className="mb-4 flex flex-wrap gap-3">
          <Link className="hover:text-systemBlue" href="/methodology">
            Methodology
          </Link>
          <Link className="hover:text-systemBlue" href="/calculator-assumptions-guide">
            Assumptions
          </Link>
          <Link className="hover:text-systemBlue" href="/site-index">
            Site Index
          </Link>
          <Link className="hover:text-systemBlue" href="/privacy">
            Privacy
          </Link>
          <Link className="hover:text-systemBlue" href="/terms">
            Terms
          </Link>
          <Link className="hover:text-systemBlue" href="/disclaimer">
            Disclaimer
          </Link>
          <Link className="hover:text-systemBlue" href="/editorial-policy">
            Editorial Policy
          </Link>
          <Link className="hover:text-systemBlue" href="/release-notes">
            Release Notes
          </Link>
        </div>
        <p>{REQUIRED_DISCLAIMER}</p>
      </footer>
    </main>
  );
}
