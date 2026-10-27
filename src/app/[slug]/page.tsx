import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { citation, DATASETS, datasetJsonLd, fileUrl, formatBytes, getDataset } from '@/lib/datasets'

// Only the datasets in DATASETS exist; any other slug is a real 404.
export const dynamicParams = false

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const d = getDataset((await params).slug)
  if (!d) return {}
  return { title: d.title, description: d.summary, alternates: { canonical: `/${d.slug}` } }
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default async function DatasetPage({ params }: PageProps<'/[slug]'>) {
  const d = getDataset((await params).slug)
  if (!d) notFound()
  const [w, s, e, n] = d.bbox

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd(d)).replace(/</g, '\\u003c') }}
      />

      <header className="max-w-2xl">
        <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">
          Dataset · v{d.version} · {d.released}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{d.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{d.summary}</p>
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-mono text-sm">
          <dt className="text-muted-foreground">Area</dt>
          <dd>
            {w}°E to {e}°E, {Math.abs(s)}°S to {Math.abs(n)}°S
          </dd>
          <dt className="text-muted-foreground">Period</dt>
          <dd>{d.temporalCoverage.replace('/', ' to ')}</dd>
          <dt className="text-muted-foreground">Licence</dt>
          <dd>
            <a href={d.licence.url}>{d.licence.name}</a>
          </dd>
        </dl>
      </header>

      <Section title="Files">
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted font-mono text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">File</th>
                <th className="px-4 py-2 font-medium">Contents</th>
                <th className="px-4 py-2 text-right font-medium">Size</th>
              </tr>
            </thead>
            <tbody>
              {d.files.map((f) => (
                <tr key={f.name} className="border-t align-top">
                  <td className="px-4 py-3 font-mono whitespace-nowrap">
                    <a href={fileUrl(d, f)} download>
                      {f.name}
                    </a>
                    <div className="text-xs text-muted-foreground">{f.format}</div>
                  </td>
                  <td className="px-4 py-3">{f.description}</td>
                  <td className="px-4 py-3 text-right font-mono whitespace-nowrap">{formatBytes(f.bytes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Checksums (SHA-256) for every file are in <a href={`/files/${d.slug}/manifest.json`}>manifest.json</a>.
        </p>
      </Section>

      <Section title="Sources">
        <ul className="space-y-3">
          {d.sources.map((src) => (
            <li key={src.name}>
              <a href={src.url}>{src.name}</a>, {src.provider}. <span className="text-muted-foreground">{src.licence}.</span>{' '}
              Used for: {src.usedFor.toLowerCase()}.
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Method">
        <ul className="list-disc space-y-2 pl-5">
          {d.method.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </Section>

      <Section title="Caveats">
        <ul className="list-disc space-y-2 pl-5">
          {d.caveats.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section title="How to cite">
        <p className="rounded-lg border bg-card p-4 font-mono text-sm">{citation(d)}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Please cite the original sources above as well. Released under {d.licence.name}: use it for anything,
          with attribution.
        </p>
      </Section>

      <Section title="Related">
        <ul className="space-y-2">
          {d.related.map((r) => (
            <li key={r.url}>
              <a href={r.url}>{r.label}</a>
            </li>
          ))}
        </ul>
      </Section>
    </article>
  )
}
