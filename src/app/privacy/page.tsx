export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for the Roth Conversion Calculator educational tool.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold">Privacy Policy</h1>
      <p className="mt-4 leading-7">
        Calculator inputs run locally in your browser by default. If you use the AI Roth Conversion Explainer, the
        question and relevant calculator context may be sent to the model provider through our server route. Do not enter
        SSNs, account numbers, names, addresses, or other sensitive personal information.
      </p>
    </main>
  );
}
