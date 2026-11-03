import { OG_SIZE, shareCard } from '@/lib/og-card'
import { DATASETS } from '@/lib/datasets'

export const alt = 'Open climate data for Malawi, by Jimmy Matewere'
export const size = OG_SIZE
export const contentType = 'image/png'

export default function Image() {
  const n = DATASETS.length
  return shareCard({
    eyebrow: 'OPEN DATA',
    title: 'Climate data for Malawi',
    subtitle: 'Cleaned, documented and free to reuse, with sources, methods and limits.',
    footer: `${n} DATASET${n === 1 ? '' : 'S'}, CC BY 4.0`,
    address: 'data.matewere.dev',
  })
}
