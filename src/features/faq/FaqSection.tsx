import { faqItems } from "@/features/faq/faq-items";

export function FaqSection() {
  return (
    <section className="grid gap-4" id="faq">
      <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Roth Conversion FAQ</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {faqItems.map((faq) => (
          <details className="rounded-md border border-neutral-200 bg-white p-4 dark:border-white/10 dark:bg-neutral-950" key={faq.question}>
            <summary className="cursor-pointer text-base font-semibold text-neutral-950 dark:text-white">
              {faq.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
