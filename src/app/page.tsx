import Link from 'next/link'
import { DATASETS, formatBytes } from '@/lib/datasets'

export default function Home() {
  return (
    <>
      <section className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Open climate data for Malawi</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Datasets I have cleaned for my own work, published with their sources, methods and limits so you can
          reuse them. Plain formats, free to use with attribution.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-mono text-xs tracking-[0.2em] text-muted-foreground uppercase">Datasets</h2>
        <ul className="mt-4 space-y-4">
          {DATASETS.map((d) => {
            const total = d.files.reduce((sum, f) => sum + f.bytes, 0)
            return (
              <li key={d.slug}>
                <Link
                  href={`/${d.slug}`}
                  className="block rounded-lg border bg-card p-5 text-foreground no-underline transition-transform hover:-translate-y-0.5"
                >
                  <h3 className="text-lg font-bold">{d.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{d.summary}</p>
                  <p className="mt-3 font-mono text-xs text-muted-foreground">
                    v{d.version} · {d.files.length} files · {formatBytes(total)} · {d.licence.name}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
