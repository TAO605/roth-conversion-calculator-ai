import Link from "next/link";
import { taxPaymentMethodPages } from "@/content/tax-payment-method-pages";
import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";
import { breadcrumbJsonLd } from "@/core/seo/json-ld";

export const metadata = {
  title: "Roth Conversion Tax Payment Methods",
  description:
    "Educational pages explaining how the Roth Conversion Calculator models outside funds, IRA withholding, and not-sure tax payment assumptions.",
  alternates: { canonical: "/tax-payment-methods" },
};

export default function TaxPaymentMethodsIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-7 px-4 py-10">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Calculator", path: "/" },
              { name: "Tax Payment Methods", path: "/tax-payment-methods" },
            ]),
          ),
        }}
        type="application/ld+json"
      />
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Tax payment assumptions</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">
          Roth Conversion Tax Payment Methods
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Compare how the calculator treats outside-funds tax payment, IRA withholding, and not-sure assumptions. These
          pages explain the model, not what a user should choose.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {taxPaymentMethodPages.map((page) => (
          <Link
            className="rounded-[20px] bg-white/75 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-material dark:bg-white/10"
            href={`/tax-payment-methods/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">{page.label}</p>
            <h2 className="mt-3 text-2xl font-bold text-neutral-950 dark:text-white">{page.title}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.penaltyNote}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-systemBlue">Open method page</span>
          </Link>
        ))}
      </section>

      <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
