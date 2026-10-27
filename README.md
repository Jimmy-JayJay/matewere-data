# matewere-data

This is the code and data behind [data.matewere.dev](https://data.matewere.dev).

I clean a lot of Malawi climate data for my own projects, and most of it ends up sitting in a cache folder where nobody else can use it. This site is where I put the useful parts, in plain formats, with a note on where each number came from and what it can't tell you.

The first dataset is Cyclone Freddy (March 2023): the storm's track from IBTrACS, CHIRPS daily rainfall and GPM IMERG hourly rainfall over southern Malawi, as grids and as tables for all 28 districts. It is the data behind [freddy.matewere.dev](https://freddy.matewere.dev).

## Using the data

Download what you need from the dataset page. Everything is CC BY 4.0, so use it however you like and credit it. Please cite the original sources too; they are listed on each page. Each folder in `public/files/` has a `manifest.json` with file sizes and SHA-256 checksums.

If you find a mistake, email hello@matewere.dev or open an issue.

## How it fits together

Each dataset is written up once in `src/lib/datasets.ts`. The page, the sitemap and the structured metadata that Google Dataset Search reads all come from that entry, so nothing is typed twice.

The files themselves are produced by the project that made them. For Freddy that is `pipeline/export.py` in the freddy-replay repo, which is private for now; the method is written out in full on the dataset page. To rebuild the files from there:

```bash
cd freddy-replay/pipeline
uv run python imerg.py      # needs EARTHDATA_TOKEN in pipeline/.env
uv run python export.py ../../matewere-data/public/files/freddy-2023
```

## Running it locally

```bash
pnpm install
pnpm dev
```

Jimmy Matewere, [matewere.dev](https://matewere.dev)
