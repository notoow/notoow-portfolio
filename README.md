# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Manual YouTube Links (Recommended for Unlisted)

If you want to show unlisted YouTube videos on the portfolio, you do not need Supabase.

Setup:

1. Open `src/data/portfolioVideos.js`
2. Add each unlisted video under one of these categories:
   - `디자인`
   - `3D`
   - `예능`
3. For each item, add at least `title` and `url`

Example:

```js
디자인: [
  {
    title: '브랜드 필름 편집',
    url: 'https://www.youtube.com/watch?v=VIDEO_ID',
    desc: '인트로 / 모션그래픽 / 컬러그레이딩',
  },
]
```

The app will extract the YouTube video ID from the URL and open the video in the portfolio lightbox.
`portfolioVideoMode` is currently set to `manual`, so only the links in that file will be shown.

## Optional: YouTube Auto Parsing

This project can auto-load videos from a YouTube channel and split them by title tags:

- `[디자인] ...` -> Edit section
- `[3D] ...` -> 3D section
- `[예능] ...` -> Film section

Setup:

1. Copy `.env.example` to `.env`
2. Fill `VITE_YOUTUBE_API_KEY`
3. Keep or change `VITE_YOUTUBE_CHANNEL_ID`

The site uses YouTube Data API v3 (`channels` + `playlistItems`) and no manual per-video input is needed.

## Optional: Supabase Video Source

Because YouTube API key mode cannot list all unlisted videos automatically, the app supports Supabase as the primary source.

Setup:

1. Run SQL in `supabase/portfolio_videos.sql`
2. Add to `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Insert rows into `portfolio_videos` with `category_tag` as one of:
   - `디자인`
   - `3D`
   - `예능`

Read flow:

- If Supabase has rows for a category, those are used first.
- If no rows exist, the app falls back to YouTube Data API.

### CLI Management

Set these in `.env` for write commands:

- `SUPABASE_URL` (or `VITE_SUPABASE_URL`)
- `SUPABASE_SERVICE_ROLE_KEY`

Commands:

- List active videos:
  - `npm run videos:list -- --category 디자인`
- List including inactive:
  - `npm run videos:list -- --all --limit 200`
- Upsert from CSV/JSON:
  - `npm run videos:upsert -- --file ./data/videos.csv --dry-run`
  - `npm run videos:upsert -- --file ./data/videos.csv`
- Disable rows:
  - `npm run videos:disable -- --id 1`
  - `npm run videos:disable -- --video-id dQw4w9WgXcQ`
  - `npm run videos:disable -- --category 예능`
