import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildKeywordLandingCalculatorHref,
  getKeywordLandingPageBySlug,
  keywordLandingPages,
} from "@/content/keyword-landing-pages";
import { calculateRothConversion } from "@/core/calculator/roth-conversion";
import type { RothConversionInput } from "@/core/calculator/types";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";
import { buildAcaPremiumTaxCreditReviewPrep } from "@/features/tax-impact-warnings/aca-review-prep";
import { buildIrmaaReviewPrep } from "@/features/tax-impact-warnings/irmaa-review-prep";
import { buildNiitReviewPrep } from "@/features/tax-impact-warnings/niit-review-prep";
import { buildSocialSecurityTaxationReviewPrep } from "@/features/tax-impact-warnings/social-security-review-prep";

interface KeywordLandingPageProps {
  params: Promise<{ keyword: string }>;
}

const defaultSampleInput: RothConversionInput = {
  conversionAmount: 50000,
  traditionalIraBalance: 250000,
  basis: 0,
  filingStatus: "single",
  currentTaxableIncome: 85000,
  stateMarginalTaxRate: 0,
  age: 45,
  penaltyException: false,
  taxPaymentMethod: "outside_funds",
  withheldForTaxes: 0,
  retirementAge: 65,
  expectedAnnualReturn: 0.07,
  retirementMarginalTaxRate: 0.22,
  inflationRate: 0.03,
  taxYear: 2026,
};

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}

function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    style: "percent",
  }).format(value);
}

function formatCurrencyWithCents(value: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: "currency",
  }).format(value);
}

export async function generateStaticParams() {
  return keywordLandingPages.map((page) => ({ keyword: page.slug }));
}

export async function generateMetadata({ params }: KeywordLandingPageProps): Promise<Metadata> {
  const { keyword } = await params;
  const page = getKeywordLandingPageBySlug(keyword);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/${page.slug}` },
  };
}

export default async function KeywordLandingPage({ params }: KeywordLandingPageProps) {
  const { keyword } = await params;
  const page = getKeywordLandingPageBySlug(keyword);

  if (!page) {
    notFound();
  }

  const sampleInput: RothConversionInput = {
    ...defaultSampleInput,
    ...page.sampleScenario,
  };
  const sampleResult = calculateRothConversion(sampleInput);
  const irmaaPrep =
    page.taxInteractionPreview === "irmaa" ? buildIrmaaReviewPrep(sampleInput, sampleResult) : null;
  const acaPrep =
    page.taxInteractionPreview === "aca" ? buildAcaPremiumTaxCreditReviewPrep(sampleInput, sampleResult) : null;
  const socialSecurityPrep =
    page.taxInteractionPreview === "social-security"
      ? buildSocialSecurityTaxationReviewPrep(sampleInput, sampleResult)
      : null;
  const niitPrep = page.taxInteractionPreview === "niit" ? buildNiitReviewPrep(sampleInput, sampleResult) : null;
  const sampleIncomeProxy = sampleInput.currentTaxableIncome + sampleResult.taxableConversion;

  return (
    <main className="mx-auto grid max-w-4xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Calculator Pages", path: "/calculators" },
              { name: page.keyword, path: `/${page.slug}` },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <nav className="text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>{" "}
        /{" "}
        <Link className="hover:text-systemBlue" href="/calculators">
          Calculator pages
        </Link>{" "}
        / {page.keyword}
      </nav>
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">{page.keyword}</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">{page.title}</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">{page.description}</p>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Search intent</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.intent}</p>
      </section>

      <article className="grid gap-4 text-base leading-8 text-neutral-700 dark:text-neutral-200">
        {page.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Sample result preview</p>
          <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">{page.sampleScenario.label}</h2>
          <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{page.resultFocus}</p>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">Taxable conversion</dt>
            <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
              {formatMoney(sampleResult.taxableConversion)}
            </dd>
          </div>
          <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">Estimated upfront cost</dt>
            <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
              {formatMoney(sampleResult.totalUpfrontCost)}
            </dd>
          </div>
          <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">Break-even year</dt>
            <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
              {sampleResult.breakEvenYear === null ? "Not reached" : `Year ${sampleResult.breakEvenYear}`}
            </dd>
          </div>
          <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
            <dt className="text-sm text-neutral-500 dark:text-neutral-400">Modeled federal effective rate</dt>
            <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
              {formatPercent(sampleResult.breakdown.effectiveFederalTaxRate)}
            </dd>
          </div>
        </dl>

        <div>
          <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Sample assumptions</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300 sm:grid-cols-2">
            {page.sampleScenario.assumptions.map((assumption) => (
              <li key={assumption} className="rounded-md bg-neutral-50 px-3 py-2 dark:bg-white/5">
                {assumption}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          This is a fixed educational sample, not stored user data and not a recommended conversion amount. Change the
          calculator inputs before using any result for professional review.
        </p>
      </section>

      {irmaaPrep ? (
        <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">IRMAA worksheet preview</p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">{irmaaPrep.title}</h2>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{irmaaPrep.summary}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Calculator income proxy</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(sampleIncomeProxy)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Part B proxy monthly premium</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatCurrencyWithCents(irmaaPrep.partBEstimate.totalMonthlyPremium)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Part D IRMAA adjustment</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatCurrencyWithCents(irmaaPrep.partDEstimate.monthlyAdjustmentAmount)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Review priority</dt>
              <dd className="mt-1 text-xl font-semibold text-neutral-950 dark:text-white">{irmaaPrep.priority}</dd>
            </div>
          </dl>

          <div>
            <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Missing review items</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {irmaaPrep.missingInputs.map((item) => (
                <li key={item} className="rounded-md bg-neutral-50 px-3 py-2 dark:bg-white/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This IRMAA preview is bounded and educational only. It uses the calculator income proxy, not SSA lookback
            MAGI, and it does not determine actual Medicare billing.
          </p>
        </section>
      ) : null}

      {acaPrep ? (
        <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">
              ACA subsidy worksheet preview
            </p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">{acaPrep.title}</h2>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{acaPrep.summary}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Income proxy before conversion</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(acaPrep.incomeProxyBeforeConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Income proxy after conversion</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(acaPrep.incomeProxyAfterConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Annual APTC at-stake preview</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {acaPrep.aptcAtStakePreview === null ? "Not estimated" : formatMoney(acaPrep.aptcAtStakePreview)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Monthly APTC preview</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {acaPrep.monthlyAdvancePremiumTaxCreditPreview === null
                  ? "Not estimated"
                  : formatMoney(acaPrep.monthlyAdvancePremiumTaxCreditPreview)}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Missing review items</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {acaPrep.missingInputs.map((item) => (
                <li key={item} className="rounded-md bg-neutral-50 px-3 py-2 dark:bg-white/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This ACA preview is bounded and educational only. It uses user-entered APTC and coverage months, not a
            final Marketplace eligibility, benchmark-plan premium, repayment-cap, or Form 8962 result.
          </p>
        </section>
      ) : null}

      {socialSecurityPrep ? (
        <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">
              Social Security worksheet preview
            </p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">
              {socialSecurityPrep.title}
            </h2>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{socialSecurityPrep.summary}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Income proxy before conversion</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(socialSecurityPrep.nonSocialSecurityIncomeProxyBeforeConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Income proxy after conversion</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(socialSecurityPrep.nonSocialSecurityIncomeProxyAfterConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Combined-income proxy</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {socialSecurityPrep.combinedIncomeProxyAfterConversion === null
                  ? "Not estimated"
                  : formatMoney(socialSecurityPrep.combinedIncomeProxyAfterConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Taxable-benefit preview</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {socialSecurityPrep.taxableBenefitPreview === null
                  ? "Not estimated"
                  : formatMoney(socialSecurityPrep.taxableBenefitPreview)}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Missing review items</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {socialSecurityPrep.missingInputs.map((item) => (
                <li key={item} className="rounded-md bg-neutral-50 px-3 py-2 dark:bg-white/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This Social Security preview is bounded and educational only. It is not a full IRS Publication 915
            worksheet and does not calculate final taxable benefits or benefit tax owed.
          </p>
        </section>
      ) : null}

      {niitPrep ? (
        <section className="grid gap-5 rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">
              NIIT worksheet preview
            </p>
            <h2 className="mt-2 text-2xl font-bold text-neutral-950 dark:text-white">{niitPrep.title}</h2>
            <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">{niitPrep.summary}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">MAGI proxy before conversion</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(niitPrep.magiProxyBeforeConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">MAGI proxy after conversion</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {formatMoney(niitPrep.magiProxyAfterConversion)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">NIIT exposure base</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {niitPrep.niitExposureBase === null ? "Not estimated" : formatMoney(niitPrep.niitExposureBase)}
              </dd>
            </div>
            <div className="rounded-md border border-neutral-200 p-4 dark:border-white/10">
              <dt className="text-sm text-neutral-500 dark:text-neutral-400">Bounded 3.8% preview</dt>
              <dd className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">
                {niitPrep.boundedNiitEstimate === null ? "Not estimated" : formatMoney(niitPrep.boundedNiitEstimate)}
              </dd>
            </div>
          </dl>

          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{niitPrep.formulaNote}</p>

          <div>
            <h3 className="text-base font-semibold text-neutral-950 dark:text-white">Missing review items</h3>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
              {niitPrep.missingInputs.map((item) => (
                <li key={item} className="rounded-md bg-neutral-50 px-3 py-2 dark:bg-white/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            This NIIT preview is bounded and educational only. It is not a full Form 8960 calculation and does not
            classify investment income, deductions, trade or business exceptions, credits, or every MAGI adjustment.
          </p>
        </section>
      ) : null}

      <section className="rounded-lg border border-neutral-200 bg-white p-5 dark:border-white/10 dark:bg-neutral-950">
        <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Use the calculator</h2>
        <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
          Open the live calculator, enter your own assumptions, and use the output only as an educational worksheet for
          professional review.
        </p>
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-systemBlue px-4 py-2 text-sm font-semibold text-white"
          href={buildKeywordLandingCalculatorHref(page)}
        >
          {page.primaryCta}
        </Link>
      </section>

      <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.disclaimer}</p>
      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
