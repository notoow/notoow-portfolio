# Next PC Handoff

## Latest Snapshot

- branch: `main`
- working tree on this PC: clean after commit/push
- GitHub Pages deploy: latest state reflected after `npm run deploy`

오늘 기준 핵심 변경:

- 메인 홈 카드 hover 떨림 완화
- 커서 꼬리 이펙트 제거, 단일 glow만 유지
- 미사용 보관용 3D 파일 정리
- 공개 앱에서 관리자 라우트 제거
- 수동 영상 모드일 때 Supabase / YouTube 모듈은 지연 로드로만 접근
- 첫 진입 번들 최적화:
  홈 텍스트 먼저 렌더 -> 3D HeroScene은 첫 페인트 직후 별도 preload/lazy mount
  나머지 상세/포트폴리오/개발 페이지도 route-level lazy load
- 홈 HeroScene 로딩 체감 개선:
  3D 청크는 첫 페인트 직후 미리 fetch 시작
  실제 Canvas는 준비 완료 후 페이드인
  placeholder gradient + 퍼센트 로딩바로 빈 장면 노출 방지
  particle / DPR도 살짝 낮춰 버벅임 완화
  마우스 추적은 React state 경유를 줄이고 HeroScene 내부에서 직접 처리
  홈 3D 오브젝트 수도 줄이고 postprocessing은 Bloom 위주로 경량화
  모바일 자이로는 기준점 재설정 + 각도 wrap 보정 + smoothing 적용
- `우주 대스타` GIF 제거 후 실제 YouTube 영상 모달로 교체
- Dev 페이지 `클로드코드로 생산성 10배 올리기`를 긴 구글슬라이드 iframe 대신
  `영상 + 한 장씩 넘기는 슬라이드 덱` 구조로 개선
- 로컬 PPT를 슬라이드 이미지로 export 해서 사이트에서 직접 렌더링
- 3D GLB 경로를 GitHub Pages base 경로 기준으로 정리

## Working Tomorrow

이 프로젝트는 현재 `manual` 영상 모드가 기본이라 `.env` 없이도 실행 가능합니다.

새 컴퓨터에서 시작 순서:

1. 저장소 클론 또는 기존 폴더에서 최신 `main` pull
2. `npm install`
3. `npm run dev`
4. 배포 전 확인은 `npm run lint` 와 `npm run build`

처음 확인 추천:

```bash
git rev-parse --short HEAD
git status
```

정상 여부는 아래로 바로 확인:

```bash
git rev-parse --short HEAD
git status
```

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
- `src/components/HeroScene.jsx`: 홈 첫 화면 3D 씬 전용
- `src/components/CursorGlow.jsx`: 가벼운 커서 glow
- `src/components/PageLoader.jsx`: lazy route 로딩 fallback
- `src/data/portfolioVideos.js`: 실제 영상 데이터
- `src/components/AdaptiveThumbnail.jsx`: 공용 썸네일 표시 / fallback
- `src/hooks/useResponsive.js`: 공용 모바일/태블릿 판별
- `src/lib/youtubeThumbnails.js`: YouTube 썸네일 후보 / probe / oEmbed fallback
- `scripts/studio-browser-export.js`: YouTube Studio export
- `scripts/studio-import.mjs`: export JSON import
- `scripts/export_case_study_slides.ps1`: 로컬 PPT를 슬라이드 이미지로 export

## Dev Case Study

현재 Dev 페이지 첫 카드 `클로드코드로 생산성 10배 올리기`는:

- 상단: YouTube 영상
- 우측/하단: one-by-one 슬라이드 덱
- 썸네일 클릭 / Prev / Next / 좌우 화살표 키로 탐색
- 외부 원본은 Google Slides 링크로 별도 열기 가능

슬라이드 이미지는 여기서 읽습니다:

- `public/case-studies/claude-code/slide-01.jpg`
- ...
- `public/case-studies/claude-code/slide-22.jpg`

로컬 PPT에서 다시 export 해야 할 때:

```powershell
./scripts/export_case_study_slides.ps1
```

기본 입력 파일:

- `C:\Users\tan01\Desktop\@ALLFILES\우탄개발폴더\탄_최종자료.pptx`

주의:

- 이 PPTX는 300MB가 넘어서 일반 GitHub repo에 직접 커밋 불가
- 실제 배포엔 export된 `jpg` 슬라이드만 포함

## Video Workflow

### Direct edit

- `src/data/portfolioVideos.js` 에서 제목, 순서, 섹션을 직접 수정

편집 카테고리 내부 섹션:

- `section: 'edit'`
- `section: 'motion'`
- `section: 'design'`
- `section: 'ai'`

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

중요:

- 이제 `scripts/studio-import.mjs` 는 `Downloads` 와 `Desktop/CustomDownloads` 안의
  `studio-videos.json`, `studio-videos (1).json`, `studio-videos (2).json` 같은 파일 중
  가장 최근 수정된 export를 자동으로 선택함
- 예전에는 exact filename(`studio-videos.json`)만 읽어서 최신 export가 반영 안 되는 문제가 있었음
- `고양시지속가능발전협의회 홍보영상` 같은 수동 추가 영상은 import 후에도 유지되도록 스크립트에 반영함

## Known Good Current State

- 메인 홈/포트폴리오/상세 페이지 해시 라우팅 정리됨
- 상세 페이지 진입 시 스크롤 상단 리셋됨
- 연락 버튼은 메일 앱이 아니라 사이트 내부 팝업 사용
- 문의 이메일: `tan0123@naver.com`
- 첫 진입에서 Three/Drei가 메인 번들에 직접 실리지 않도록 정리됨
- 공개 앱에는 `#admin-videos` 라우트가 더 이상 연결되지 않음
- 개발 페이지 `우주 대스타`는 현재 YouTube 영상 모달 사용
- `고양시지속가능발전협의회 홍보영상` 썸네일은 고정 `hqdefault` 로 설정됨
- `#home`, `#portfolio`, `#film`, `#edit`, `#3d`, `#dev` 모바일 반응형 1차 정리 완료
- `Interactive.jsx` 의 스킬 섹션 / 가로 갤러리 / CTA / 푸터도 모바일 대응 반영
- 촬영/편집/3D 상세 카드와 라이트박스도 모바일 대응 반영
- 썸네일은 이제 `maxresdefault -> sddefault -> hqdefault -> mqdefault -> oEmbed` 순서로 더 똑똑하게 fallback
- 이미 수동으로 넣어둔 같은 영상의 `ytimg` 썸네일 URL은 강제로 다른 품질로 바꾸지 않음
- Dev 페이지 케이스 스터디는 현재 `scroll-heavy` 가 아니라 `step-by-step deck` 방식
- 편집 페이지는 현재 `영상편집 / 모션그래픽 / 디자인 제작 / AI` 4섹션 구조

## Bundle Notes

- 이전에는 `App.jsx` 와 `Home.jsx` 가 처음부터 모든 페이지와 Three 씬을 정적 import 했음
- 지금은:
  - `App.jsx` 에서 `Interactive / Film / Edit / 3D / Dev / Terminal / Minimal / Admin` 모두 lazy load
  - `Home.jsx` 는 텍스트/레이아웃 먼저 렌더하고 `HeroScene.jsx` 를 idle 시점에 lazy load
  - `CursorGlow` 와 로딩 UI도 Three 파일에서 분리
- 그래서 첫 진입 index 청크가 크게 줄었고, 무거운 `three / drei` 청크는 홈 3D가 실제로 필요할 때만 내려받음

## Responsive Scope

이번에 모바일 대응한 주요 페이지:

- `src/pages/Home.jsx`
- `src/pages/Interactive.jsx`
- `src/pages/CategoryDetail.jsx`
- `src/pages/DevPage.jsx`

체크 포인트:

- iPhone급 폭에서 상단 네비 줄바꿈/겹침 없는지
- `#portfolio` 스킬 섹션이 1열로 자연스럽게 보이는지
- `#portfolio` 가로 프로젝트 카드가 터치 스와이프 가능한지
- 상세 페이지 카드가 1열로 보이고 모달 닫기 버튼이 화면 밖으로 안 나가는지
- 홈 첫 화면에서 커서 숨김 같은 데스크톱 전용 동작이 모바일에서 거슬리지 않는지

## Thumbnail Notes

지금 구조는 단순히 `maxresdefault` 하나만 쓰는 방식이 아닙니다.

- 수동 지정 썸네일이 같은 영상의 `ytimg` URL이면 그대로 우선 사용
- 해당 썸네일이 실패하면 다른 품질 후보를 순서대로 시도
- 그래도 실패하면 YouTube `oEmbed` thumbnail URL 사용

관련 수정 포인트:

- `src/components/AdaptiveThumbnail.jsx`
- `src/lib/youtubeThumbnails.js`

## Nice Next Improvements

- 포트폴리오 카드별 설명문을 조금 더 프로젝트 중심으로 다듬기
- 편집 / 촬영 / 3D 상세 페이지에서 대표작 우선순위 재정렬
- 썸네일 누락 영상 자동 점검 스크립트 추가
- DevPage 프로젝트 카드에 외부 링크 / 팝업 타입을 명시적으로 분리한 공용 컴포넌트화
- 큰 페이지들의 inline style 일부를 공용 스타일 또는 컴포넌트로 정리
- `Home.jsx` 의 `BentoPreview` 도 `useResponsive` 훅으로 통일 가능
- 페이지별 터치 제스처 / hover-only 인터랙션을 더 줄여서 모바일 UX 다듬기
- 실제 기기에서 세로/가로 회전 시 레이아웃 재확인
- 케이스 스터디 슬라이드에 섹션 라벨/챕터 메타데이터 추가
- 필요하면 슬라이드 이미지를 `webp` 로 더 압축
- Dev 케이스 스터디를 다른 프로젝트에도 재사용 가능한 공용 모달로 추출

## Quick Check Before Push

```bash
npm run lint
npm run build
git status
```

배포까지 할 경우:

```bash
git push origin main
npm run deploy
```

## Notes

- GitHub Pages 기준 `vite.config.js` 의 `base` 는 `/notoow-portfolio/`
- 저장소 이름이 바뀌면 `vite.config.js` 와 `index.html` 의 OG/Twitter URL 도 같이 수정
