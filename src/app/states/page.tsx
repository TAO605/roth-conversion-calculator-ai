import Link from "next/link";
import { statePages } from "@/content/state-pages";

export const metadata = {
  title: "Roth Conversion Calculator by State",
  description: "State-specific Roth conversion calculator pages with federal tax and state tax assumptions.",
  alternates: { canonical: "/states" },
};

export default function StatesIndexPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-10">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">State examples</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">Roth Conversion Calculator by State</h1>
        <p className="mt-4 max-w-3xl leading-7 text-neutral-600 dark:text-neutral-300">
          Explore state-specific educational pages for Roth conversion tax assumptions. Each page links back to the
          calculator and explains where professional verification is required.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statePages.map((page) => (
          <Link
            className="rounded-lg border border-neutral-200 bg-white p-5 transition hover:border-systemBlue dark:border-white/10 dark:bg-neutral-950"
            href={`/states/${page.slug}`}
            key={page.slug}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-systemBlue">{page.stateCode}</p>
            <h2 className="mt-3 text-xl font-bold text-neutral-950 dark:text-white">{page.stateName}</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{page.stateTaxSummary}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
