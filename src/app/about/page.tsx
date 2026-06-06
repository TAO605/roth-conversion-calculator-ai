export const metadata = {
  title: "About",
  description: "About the Roth Conversion Calculator educational tool.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="mt-4 leading-7">
        Roth Conversion Calculator is an educational tool built to explain Roth conversion tax estimates, assumptions,
        and tradeoffs. It is not a tax firm, financial advisor, broker, or law firm.
      </p>
    </main>
  );
}
