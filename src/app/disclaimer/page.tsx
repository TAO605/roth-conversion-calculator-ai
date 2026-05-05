import { REQUIRED_DISCLAIMER } from "@/core/compliance/disclaimer";

export const metadata = {
  title: "Disclaimer",
  description: "Tax, financial, legal, and investment disclaimer for the Roth Conversion Calculator.",
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold">Disclaimer</h1>
      <p className="mt-4 leading-7">{REQUIRED_DISCLAIMER}</p>
    </main>
  );
}
