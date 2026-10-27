import type { MetadataRoute } from 'next'
import { DATASETS, SITE } from '@/lib/datasets'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.url, changeFrequency: 'monthly' },
    ...DATASETS.map((d) => ({ url: `${SITE.url}/${d.slug}`, lastModified: d.released })),
  ]
}
