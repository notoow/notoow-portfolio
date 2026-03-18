# NOTOOW Portfolio

촬영, 편집, 3D, 개발 작업을 한 번에 보여주는 Vite + React 기반 포트폴리오입니다.

현재 배포 주소:

- `https://notoow.github.io/notoow-portfolio/`

## 현재 구조

- 메인 랜딩: `#home`
- 전체 포트폴리오: `#portfolio`
- 촬영 포트폴리오: `#film`
- 편집 포트폴리오: `#edit`
- 3D 포트폴리오: `#3d`
- 개발 포트폴리오: `#dev`

`#interactive` 는 예전 주소 호환용 별칭이며, 현재는 `#portfolio` 흐름으로 합쳐져 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

추가 명령:

```bash
npm run build
npm run lint
npm run deploy
```

## 영상 데이터 관리

현재 기본 모드는 `manual` 이며, `.env` 없이도 사이트 실행이 가능합니다.

실제 영상 데이터는 아래 파일에서 관리합니다:

- `src/data/portfolioVideos.js`

카테고리 키:

- `디자인`
- `3D`
- `예능`

편집 페이지는 `디자인` 카테고리 안에서 다시 4개 섹션으로 나뉩니다:

- `section: 'edit'`
- `section: 'motion'`
- `section: 'design'`
- `section: 'ai'`

예시:

```js
디자인: [
    {
        title: '프로젝트 제목',
        url: 'https://www.youtube.com/watch?v=VIDEO_ID',
        section: 'edit',
        type: 'YouTube Unlisted',
        desc: '설명',
        thumbnail: 'https://i.ytimg.com/vi/VIDEO_ID/maxresdefault.jpg',
    },
]
```

`url` 또는 `videoId`만 있으면 라이트박스/모달에서 바로 재생할 수 있습니다.

## YouTube Studio에서 한 번에 가져오기

일부공개 영상을 수동으로 하나씩 붙이는 대신, YouTube Studio 목록을 한 번 추출해서 가져올 수 있습니다.

### 1. Studio 목록 export

- 파일: `scripts/studio-browser-export.js`
- YouTube Studio `동영상` 목록 페이지에서 DevTools `Console`에 붙여넣고 실행
- 실행 후 `studio-videos.json` 다운로드

### 2. 프로젝트 데이터로 import

```bash
node scripts/studio-import.mjs
```

또는 직접 경로 지정:

```bash
node scripts/studio-import.mjs "C:\path\to\studio-videos.json"
```

기본 검색 경로:

- `~/Downloads/studio-videos.json`
- `~/Desktop/CustomDownloads/studio-videos.json`

주의:

- 자동 분류는 1차 분류입니다
- import 후에는 반드시 `src/data/portfolioVideos.js` 를 열어서 제목, 순서, `section` 값을 최종 확인하세요

## 썸네일 품질

유튜브 썸네일은 고화질 우선 순위로 처리됩니다.

- `maxresdefault`
- `sddefault`
- `hqdefault`
- `mqdefault`

관련 파일:

- `src/lib/youtubeThumbnails.js`
- `src/pages/CategoryDetail.jsx`
- `src/pages/Interactive.jsx`

## 선택 사항: 환경 변수

현재 수동 모드에서는 필수가 아닙니다.

필요한 경우에만 `.env.example` 을 복사해 사용하세요:

```bash
Copy-Item .env.example .env
```

옵션 환경 변수:

- `VITE_YOUTUBE_API_KEY`
- `VITE_YOUTUBE_CHANNEL_ID`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

용도:

- YouTube API fallback
- Supabase 기반 영상 목록 조회
- Supabase CLI 쓰기 스크립트

참고:

- 공개 배포본에는 관리자 페이지 라우트가 연결되어 있지 않습니다
- Supabase 관련 항목은 레거시 fallback / CLI 관리 용도로만 남아 있습니다

## 레거시 Supabase / YouTube 스크립트

현재 포트폴리오는 수동 모드가 기본이지만, 아래 스크립트는 그대로 남아 있습니다.

```bash
npm run videos:list -- --category 디자인
npm run videos:upsert -- --file ./data/videos.csv --dry-run
npm run videos:disable -- --video-id dQw4w9WgXcQ
```

관련 파일:

- `scripts/videos-list.mjs`
- `scripts/videos-upsert.mjs`
- `scripts/videos-disable.mjs`
- `supabase/portfolio_videos.sql`

## 주요 파일

- `src/pages/Home.jsx`: 메인 랜딩
- `src/pages/Interactive.jsx`: 전체 포트폴리오 페이지
- `src/pages/CategoryDetail.jsx`: 촬영/편집/3D 공통 상세 템플릿
- `src/pages/DevPage.jsx`: 개발 포트폴리오
- `src/data/portfolioVideos.js`: 영상 데이터 소스
- `scripts/studio-browser-export.js`: Studio 목록 export
- `scripts/studio-import.mjs`: export JSON import

## 배포 메모

- GitHub Pages 기준 `vite.config.js` 의 `base` 는 `/notoow-portfolio/`
- 저장소 이름이나 배포 경로가 바뀌면 아래도 함께 확인해야 합니다:
  - `vite.config.js`
  - `index.html` 의 OG / Twitter URL

## 인수인계 메모

내일 다른 컴퓨터에서 이어서 작업할 때는 아래 문서를 먼저 보면 됩니다:

- `NEXT_PC_HANDOFF.md`
