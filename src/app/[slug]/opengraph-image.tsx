import { OG_SIZE, shareCard } from '@/lib/og-card'
import { DATASETS, getDataset } from '@/lib/datasets'

export const alt = 'Dataset on data.matewere.dev'
export const size = OG_SIZE
export const contentType = 'image/png'

export function generateStaticParams() {
  return DATASETS.map((d) => ({ slug: d.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const d = getDataset((await params).slug)
  if (!d) return new Response('Not found', { status: 404 })
  const formats = [...new Set(d.files.map((f) => f.format.replace('Cloud Optimised ', '')))].join(', ')
  return shareCard({
    eyebrow: `DATASET V${d.version}`,
    title: d.shareTitle,
    subtitle: d.shareLine,
    footer: `${d.files.length} FILES: ${formats.toUpperCase()}`,
    address: `data.matewere.dev/${d.slug}`,
  })
}
