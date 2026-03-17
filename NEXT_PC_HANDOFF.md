# Next PC Handoff

## Working Tomorrow

이 프로젝트는 현재 `manual` 영상 모드가 기본이라 `.env` 없이도 실행 가능합니다.

새 컴퓨터에서 시작 순서:

1. 저장소 클론
2. `npm install`
3. `npm run dev`
4. 배포 전 확인은 `npm run lint` 와 `npm run build`

배포:

```bash
npm run deploy
```

## Optional Env

지금 작업본은 필수는 아니지만, 아래 기능을 쓸 때만 `.env` 가 필요합니다.

- `VITE_YOUTUBE_API_KEY`: YouTube API fallback
- `VITE_YOUTUBE_CHANNEL_ID`: 채널 지정
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

`.env` 는 이미 `.gitignore` 에서 제외되어 있습니다.

## Main Files

- `src/pages/Home.jsx`: 메인 랜딩
- `src/pages/Interactive.jsx`: 전체 포트폴리오
- `src/pages/CategoryDetail.jsx`: 촬영/편집/3D 공통 상세
- `src/pages/DevPage.jsx`: 개발 페이지
- `src/data/portfolioVideos.js`: 실제 영상 데이터
- `scripts/studio-browser-export.js`: YouTube Studio export
- `scripts/studio-import.mjs`: export JSON import

## Video Workflow

### Direct edit

- `src/data/portfolioVideos.js` 에서 제목, 순서, 섹션을 직접 수정

편집 카테고리 내부 섹션:

- `section: 'edit'`
- `section: 'motion'`
- `section: 'design'`

### One-time Studio import

1. YouTube Studio 동영상 목록에서 `scripts/studio-browser-export.js` 실행
2. `studio-videos.json` 다운로드
3. 아래 실행:

```bash
node scripts/studio-import.mjs
```

또는:

```bash
node scripts/studio-import.mjs "C:\path\to\studio-videos.json"
```

## Known Good Current State

- 메인 홈/포트폴리오/상세 페이지 해시 라우팅 정리됨
- 상세 페이지 진입 시 스크롤 상단 리셋됨
- 연락 버튼은 메일 앱이 아니라 사이트 내부 팝업 사용
- 문의 이메일: `tan0123@naver.com`
- 개발 페이지 `우주 대스타`는 현재 GIF 팝업 사용
- `고양시지속가능발전협의회 홍보영상` 썸네일은 고정 `hqdefault` 로 설정됨

## Nice Next Improvements

- `우주 대스타` 실제 YouTube 링크 받으면 GIF 팝업 대신 영상 모달로 교체
- 포트폴리오 카드별 설명문을 조금 더 프로젝트 중심으로 다듬기
- 편집 / 촬영 / 3D 상세 페이지에서 대표작 우선순위 재정렬
- 썸네일 누락 영상 자동 점검 스크립트 추가
- DevPage 프로젝트 카드에 외부 링크 / 팝업 타입을 명시적으로 분리한 공용 컴포넌트화
- 큰 페이지들의 inline style 일부를 공용 스타일 또는 컴포넌트로 정리

## Quick Check Before Push

```bash
npm run lint
npm run build
git status
```

## Notes

- GitHub Pages 기준 `vite.config.js` 의 `base` 는 `/notoow-portfolio/`
- 저장소 이름이 바뀌면 `vite.config.js` 와 `index.html` 의 OG/Twitter URL 도 같이 수정
