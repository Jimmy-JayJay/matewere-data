// Every dataset is described here, once. Pages, the sitemap and the schema.org Dataset metadata
// (what Google Dataset Search reads) are all built from these objects. File sizes and checksums
// come from the manifest.json the export script writes next to the files, never typed by hand.

import freddyManifest from '../../public/files/freddy-2023/manifest.json'

export const SITE = {
  url: 'https://data.matewere.dev',
  title: 'matewere.dev data',
  description:
    'Open climate and weather datasets for Malawi, cleaned and documented by Jimmy Matewere, with sources, methods and caveats.',
}

export const AUTHOR = {
  '@type': 'Person',
  name: 'Jimmy Matewere',
  url: 'https://matewere.dev',
  email: 'hello@matewere.dev',
} as const

type Manifest = { generated: string; files: { name: string; bytes: number; sha256: string }[] }

export type DataFile = {
  name: string
  format: string
  encodingFormat: string // MIME type, for schema.org
  description: string
  bytes: number
  sha256: string
}

export type Source = { name: string; provider: string; licence: string; url: string; usedFor: string }

export type Dataset = {
  slug: string
  version: string
  released: string // ISO date
  title: string
  summary: string
  keywords: string[]
  temporalCoverage: string // ISO 8601 interval
  bbox: [west: number, south: number, east: number, north: number]
  licence: { name: string; url: string }
  sources: Source[]
  files: DataFile[]
  method: string[]
  caveats: string[]
  related: { label: string; url: string }[]
}

function withManifest(manifest: Manifest, files: Omit<DataFile, 'bytes' | 'sha256'>[]): DataFile[] {
  return files
    .filter((f) => manifest.files.some((m) => m.name === f.name))
    .map((f) => {
      const m = manifest.files.find((x) => x.name === f.name)!
      return { ...f, bytes: m.bytes, sha256: m.sha256 }
    })
}

const freddy: Dataset = {
  slug: 'freddy-2023',
  version: '1.0',
  released: '2026-10-27',
  title: 'Cyclone Freddy over Malawi, March 2023: track and rainfall',
  summary:
    'The best track of Tropical Cyclone Freddy, the longest-lived tropical cyclone on record, and the rain it brought to southern Malawi: CHIRPS daily rainfall for 6 to 16 March 2023 and GPM IMERG hourly rainfall for 10 to 16 March, as grids and as per-district tables for all 28 districts.',
  keywords: [
    'Cyclone Freddy',
    'Malawi',
    'rainfall',
    'tropical cyclone',
    'CHIRPS',
    'GPM IMERG',
    'IBTrACS',
    'flood',
    'Southern Africa',
  ],
  temporalCoverage: '2023-02-04T12:00Z/2023-03-16T23:59Z',
  bbox: [32.0, -18.5, 37.5, -9.3],
  licence: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  sources: [
    {
      name: 'IBTrACS v04r01, South Indian basin',
      provider: 'NOAA NCEI',
      licence: 'Public domain',
      url: 'https://www.ncei.noaa.gov/products/international-best-track-archive',
      usedFor: 'Track, wind, pressure, landfalls',
    },
    {
      name: 'CHIRPS v2.0 Africa daily, 0.05°',
      provider: 'UCSB Climate Hazards Center',
      licence: 'CC BY 4.0',
      url: 'https://www.chc.ucsb.edu/data/chirps',
      usedFor: 'Daily and accumulated rainfall, district statistics',
    },
    {
      name: 'GPM IMERG Final Run V07B, half-hourly, 0.1°',
      provider: 'NASA GES DISC, doi:10.5067/GPM/IMERG/3B-HH/07',
      licence: 'NASA open data policy (cite the DOI)',
      url: 'https://doi.org/10.5067/GPM/IMERG/3B-HH/07',
      usedFor: 'Hourly rainfall, district statistics',
    },
    {
      name: 'geoBoundaries Malawi ADM2 2020',
      provider: 'William & Mary geoLab',
      licence: 'CC BY 3.0 IGO',
      url: 'https://www.geoboundaries.org',
      usedFor: 'District polygons and district statistics',
    },
  ],
  files: withManifest(freddyManifest, [
    {
      name: 'track.csv',
      format: 'CSV',
      encodingFormat: 'text/csv',
      description:
        'One row per IBTrACS fix (305, 4 February to 14 March): time (UTC), position, 1-minute wind (kt), pressure (hPa), nature, USA_SSHS class (-1 depression, 0 storm, 1 to 5 category), distance to land (km), landfall flag.',
    },
    {
      name: 'track.geojson',
      format: 'GeoJSON',
      encodingFormat: 'application/geo+json',
      description: 'The same track as a LineString with the three landfalls, plus one Point per fix.',
    },
    {
      name: 'chirps-daily.nc',
      format: 'NetCDF',
      encodingFormat: 'application/x-netcdf',
      description: 'CHIRPS daily rainfall (mm/day), 6 to 16 March 2023, 0.05° grid, 32.0 to 37.5°E, 18.5 to 9.3°S. No data is NaN.',
    },
    {
      name: 'chirps-total.tif',
      format: 'Cloud Optimised GeoTIFF',
      encodingFormat: 'image/tiff',
      description: 'CHIRPS accumulated rainfall (mm), 6 to 16 March 2023, same grid. EPSG:4326, nodata NaN.',
    },
    {
      name: 'chirps-district-daily.csv',
      format: 'CSV',
      encodingFormat: 'text/csv',
      description: 'Per district and day: mean and maximum daily rain, and mean accumulated rain since 6 March (mm).',
    },
    {
      name: 'imerg-hourly.nc',
      format: 'NetCDF',
      encodingFormat: 'application/x-netcdf',
      description:
        'IMERG hourly rainfall (mm in the hour), 10 to 16 March 2023 (168 hours, UTC), 0.1° grid over the same window. An hour with a missing half-hour is NaN.',
    },
    {
      name: 'imerg-district-hourly.csv',
      format: 'CSV',
      encodingFormat: 'text/csv',
      description: 'Per district and hour: mean hourly rain and mean accumulated rain since 10 March 00:00 UTC (mm).',
    },
    {
      name: 'districts.geojson',
      format: 'GeoJSON',
      encodingFormat: 'application/geo+json',
      description: 'The 28 district polygons the statistics use (geoBoundaries Malawi ADM2 2020).',
    },
  ]),
  method: [
    'Track: IBTrACS fixes for FREDDY, season 2023, main track only. Wind is JTWC 1-minute sustained (USA_WIND), falling back to WMO_WIND; pressure is WMO_PRES, falling back to USA_PRES. A landfall is a fix at zero distance to land directly after one at sea.',
    'CHIRPS: each daily GeoTIFF is clipped to the window on whole pixels; values below 0 (nodata and ocean) become NaN. District statistics use the cell-centre rule on the CHIRPS grid.',
    'IMERG: half-hourly rates subset over OPeNDAP; an hour is the sum of its two half-hour rates × 0.5 h. District statistics use all touched cells, so small districts such as Chiradzulu still get several 0.1° cells.',
    'Missing values stay missing: NaN in the grids and an empty field in the CSVs, never 0.',
  ],
  caveats: [
    'CHIRPS blends infrared satellite estimates with station data and is smooth by construction, so it understates local extremes. Gauges in the worst-hit places recorded more.',
    'Over 10 to 16 March, IMERG totals in the eight southern districts are 1.8 to 2.3 times the CHIRPS totals (mean 1.85; Mulanje 359 against 182 mm). Further north the gap shrinks and can reverse. Neither is the truth for any one place; use IMERG for timing and CHIRPS for amounts, and say which you used.',
    'The track uses 1-minute winds to match Saffir-Simpson categories. RSMC La Réunion, the WMO agency for this basin, reports 10-minute winds, which run about 10 to 15% lower.',
    'Times are UTC. Malawi is UTC+2 (Africa/Blantyre).',
  ],
  related: [
    { label: 'Interactive story: Cyclone Freddy, five weeks, one storm', url: 'https://freddy.matewere.dev' },
    { label: 'Project write-up', url: 'https://matewere.dev/work/cyclone-freddy-replay' },
  ],
}

export const DATASETS: Dataset[] = [freddy]

export function getDataset(slug: string): Dataset | undefined {
  return DATASETS.find((d) => d.slug === slug)
}

export function fileUrl(d: Dataset, f: DataFile): string {
  return `/files/${d.slug}/${f.name}`
}

export function formatBytes(bytes: number): string {
  if (bytes < 1000) return `${bytes} B`
  if (bytes < 1e6) return `${(bytes / 1e3).toFixed(0)} KB`
  return `${(bytes / 1e6).toFixed(1)} MB`
}

export function citation(d: Dataset): string {
  const year = d.released.slice(0, 4)
  return `Matewere, J. (${year}). ${d.title} (Version ${d.version}) [Data set]. ${SITE.url}/${d.slug}`
}

// schema.org Dataset, the shape Google Dataset Search indexes.
export function datasetJsonLd(d: Dataset) {
  const [w, s, e, n] = d.bbox
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: d.title,
    description: d.summary,
    url: `${SITE.url}/${d.slug}`,
    version: d.version,
    datePublished: d.released,
    keywords: d.keywords,
    license: d.licence.url,
    isAccessibleForFree: true,
    creator: AUTHOR,
    temporalCoverage: d.temporalCoverage,
    spatialCoverage: {
      '@type': 'Place',
      name: 'Malawi and central Mozambique',
      geo: { '@type': 'GeoShape', box: `${s} ${w} ${n} ${e}` },
    },
    isBasedOn: d.sources.map((src) => ({ '@type': 'Dataset', name: src.name, url: src.url })),
    distribution: d.files.map((f) => ({
      '@type': 'DataDownload',
      name: f.name,
      encodingFormat: f.encodingFormat,
      contentUrl: `${SITE.url}${fileUrl(d, f)}`,
      contentSize: formatBytes(f.bytes),
    })),
  }
}
