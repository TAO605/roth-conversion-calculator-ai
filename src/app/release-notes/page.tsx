import Link from "next/link";
import { releaseNotes } from "@/content/release-notes";
import { featureRegistry } from "@/core/features/feature-registry";

export const metadata = {
  title: "Release Notes",
  description: "Small-version updates, affected areas, and rollback notes for the Roth Conversion Calculator.",
};

export default function ReleaseNotesPage() {
  return (
    <main className="mx-auto grid max-w-4xl gap-7 px-4 py-10">
      <nav className="text-sm text-neutral-500 dark:text-neutral-400">
        <Link className="hover:text-systemBlue" href="/">
          Calculator
        </Link>{" "}
        / Release notes
      </nav>

      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Maintenance log</p>
        <h1 className="mt-3 text-4xl font-bold text-neutral-950 dark:text-white">Release Notes</h1>
        <p className="mt-4 text-lg leading-8 text-neutral-600 dark:text-neutral-300">
          Public record of small, localized updates. Each entry lists the changed area and a simple rollback path.
        </p>
      </header>

      <section className="grid gap-4">
        {releaseNotes.map((note) => (
          <article className="rounded-[20px] bg-white/75 p-5 shadow-material dark:bg-white/10" key={note.version}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-systemBlue">{note.version}</p>
                <h2 className="mt-1 text-2xl font-bold text-neutral-950 dark:text-white">{note.title}</h2>
              </div>
              <p className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                {note.date} · {note.type}
              </p>
            </div>
            <p className="mt-4 leading-7 text-neutral-700 dark:text-neutral-200">{note.summary}</p>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300 md:grid-cols-2">
              <p>
                <strong>Affected area:</strong> {note.affectedArea}
              </p>
              <p>
                <strong>Rollback path:</strong> {note.rollbackPath}
              </p>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-systemBlue">Feature registry</p>
          <h2 className="mt-2 text-3xl font-bold text-neutral-950 dark:text-white">Modular Rollback Map</h2>
          <p className="mt-3 leading-7 text-neutral-600 dark:text-neutral-300">
            Core calculator code is locked. Small-version features are tracked separately so they can be disabled or
            rolled back without changing the calculation engine.
          </p>
        </div>
        <div className="grid gap-3">
          {featureRegistry.map((feature) => (
            <article
              className="rounded-[18px] border border-neutral-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/10"
              key={feature.id}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-neutral-950 dark:text-white">{feature.label}</h3>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    {feature.id} · {feature.ownerArea}
                  </p>
                </div>
                <p className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-systemBlue">
                  v{feature.version} · {feature.locked ? "locked" : `${feature.grayRate}% rollout`}
                </p>
              </div>
              <p className="mt-3 text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Rollback: {feature.rollbackPath}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
