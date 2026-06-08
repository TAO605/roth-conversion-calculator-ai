import type { CalculatorErrors } from "@/core/calculator/types";

interface ResultInputValidationNoticeProps {
  errors: CalculatorErrors;
}

export function ResultInputValidationNotice({ errors }: ResultInputValidationNoticeProps) {
  const messages = Object.values(errors).filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Input validation required before results"
      className="rounded border border-systemRed/40 bg-systemRed/5 p-4 text-sm leading-6 text-neutral-800 dark:border-systemRed/50 dark:bg-systemRed/10 dark:text-neutral-100"
      data-testid="result-input-validation-notice"
    >
      <p className="font-semibold text-systemRed">Results paused until inputs are fixed.</p>
      <p className="mt-1 text-neutral-700 dark:text-neutral-200">
        The calculator found input errors, so estimates, reports, projections, and AI explanations are held back to
        avoid showing a misleading tax scenario.
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </section>
  );
}
