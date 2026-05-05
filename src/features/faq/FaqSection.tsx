export const faqItems = [
  {
    question: "What is a Roth conversion?",
    answer:
      "A Roth conversion moves money from a pre-tax retirement account into a Roth IRA. The taxable part is generally included in income for the year of conversion.",
  },
  {
    question: "Does a Roth conversion always trigger a 10% penalty?",
    answer:
      "No. The conversion itself is different from taking cash out. If taxes are paid from outside funds, the conversion amount is not treated the same as a cash distribution used for spending.",
  },
  {
    question: "What is the 5-year rule?",
    answer:
      "Roth conversions have 5-year rule considerations for distributions. The exact treatment depends on age, account history, and distribution type.",
  },
  {
    question: "Can this calculator replace a CPA?",
    answer:
      "No. It is an educational calculator. It does not calculate every tax interaction, including IRMAA, ACA subsidies, NIIT, AMT, credits, or state-specific rules.",
  },
];

export function FaqSection() {
  return (
    <section className="grid gap-4" id="faq">
      <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Roth Conversion FAQ</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {faqItems.map((faq) => (
          <details className="rounded-[16px] bg-white/70 p-4 dark:bg-white/10" key={faq.question}>
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
