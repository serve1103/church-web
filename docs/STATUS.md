# 프로젝트 현황 및 남은 작업

> 최종 업데이트: 2026-02-26

## 완료된 작업

### Phase 1: 기초 설정
- [x] Next.js 16 + Sanity CMS 프로젝트 초기화
- [x] Tailwind CSS v4 테마 시스템 (CSS 변수 기반)
- [x] Sanity Studio `/studio` 임베드
- [x] 기본 레이아웃 (Header, Footer, Navigation)

### Phase 2: Sanity 스키마 정의
- [x] 문서 타입: page, sermon, notice, bulletin, album, prayerLetter, staff, siteSettings
- [x] 블록 스키마 11종: heroBlock, worshipInfoBlock, latestSermonBlock, noticeListBlock, directionsBlock, youtubeBlock, textBlock, imageGalleryBlock, staffBlock, timelineBlock, quickLinkBlock
- [x] GROQ 쿼리 중앙 관리 (`src/sanity/lib/queries.ts`)

### Phase 3: 프론트엔드 페이지 라우트
- [x] 홈페이지 (`/`)
- [x] 서브 페이지 (`/[slug]`) — 동적 블록 조합
- [x] 설교 목록 (`/sermons`) + 상세 (`/sermons/[slug]`)
- [x] 공지 목록 (`/notices`) + 상세 (`/notices/[slug]`)
- [x] 앨범 목록 (`/albums`) + 상세 (`/albums/[slug]`)
- [x] 기도편지 목록 (`/prayer-letters`) + 상세 (`/prayer-letters/[slug]`)
- [x] 주보 목록 (`/bulletins`)

### Phase 4: Visual Editing
- [x] Sanity Presentation tool 연동
- [x] Draft mode + live preview
- [x] stega 인코딩 공개 사이트 노출 버그 수정

### Phase 5: 네비게이션 개편
- [x] 실제 남문교회 사이트 분석 기반 계층구조 메뉴
- [x] 데스크톱 드롭다운 + 모바일 아코디언 메뉴
- [x] 메뉴 구조: 남문교회 소개 / 예배와 말씀 / 교회 소식 / 교회 학교 / 선교

### Phase 6: 콘텐츠 관리 기능 고도화
- [x] 사이트 설정 CMS (교회 이름, 주소, 전화번호, 로고)
- [x] 설교 카테고리 6종 (주일오전/오후, 수요, 새벽, 특별, 3분메시지)

### Phase 7: 블록 디자인 리뉴얼
- [x] 모든 블록 컴포넌트 모던 스타일 재디자인
- [x] QuickLinkBlock 신규 추가 (바로가기 카드 그리드)
- [x] SectionHeader / PageHeader 디자인 개선
- [x] CSS 변수 추가 (primary-dark, accent-light, border)

### Phase 8: 시드 데이터
- [x] 실제 교회 데이터 기반 시드 스크립트 (`scripts/seed.mts`)
- [x] 21개 문서: siteSettings 1, staff 6, sermon 6, notice 5, page 3 (홈/교회소개/부서소개)
- [x] 테스트 데이터 정리 스크립트 (`scripts/cleanup.mts`)

### Phase 9: SEO
- [x] 동적 metadata (각 페이지/설교/공지별)
- [x] sitemap.ts 기본 구조
- [x] robots.txt
- [x] XE → Next.js URL 리다이렉트 매핑 (`next.config.ts`)

### Phase 10: SEO 완성 및 코드 정리
- [x] 동적 sitemap 완성 (Sanity에서 sermon/notice/album/prayer-letter slug 연동)
- [x] OG 이미지 (ImageResponse로 동적 생성, metadataBase 설정)
- [x] generateStaticParams (sermon/notice/album/prayer-letter 상세 SSG)
- [x] Footer 하드코딩 색상 → CSS 변수 전환 (footer-bg, footer-border)
- [x] 카카오맵 전환 (Google Maps → 카카오맵 JavaScript SDK, Places 키워드 검색)
- [x] 불필요 라우트 정리 (/worship, /directions → /about 리다이렉트)
- [x] 카카오맵 위치 정확도 개선 (Geocoder → Places API)

### Phase 11: Sanity Studio UX 개선
- [x] `@sanity/locale-ko-kr` 한국어 로케일 적용 (시스템 UI 전반)
- [x] Presentation tool 영문 문자열 커스텀 한국어 번역
- [x] slug 필드 숨김 + 게시 시 title 기반 자동생성 (sermon, notice, album, prayerLetter)
- [x] 사이드바 정리 — "페이지 관리" 제거, "관리" 그룹화 (사이트 설정/사역자)
- [x] 스키마 설명문 한국어 통일 (Generate → 생성하기, Add item 제거)
- [x] Visual Editing 오버레이 z-index 조정 (헤더 침범 방지)

### Phase 12: 관리자 가이드 및 주보 뷰어
- [x] 관리자 가이드 작성 (`docs/admin-guide.md`) — 담임목사/사무장용 Sanity Studio 사용법
- [x] Studio 미리보기 PC↔모바일 토글 확인 (Presentation tool 내장 기능 + 한국어 번역 완료)
- [x] 주보 PDF 인라인 뷰어 (`/bulletins/[id]`) — 브라우저 내 PDF 미리보기 + 다운로드

### Phase 13: 반응형 테스트 및 수정
- [x] 18개 스크린샷 촬영 (6페이지 × 3뷰포트) + 테스트 보고서 (`docs/responsive-test-report.md`)
- [x] 설교 카테고리 필터 탭 터치 영역 확대 (`py-2` → `py-2.5`)
- [x] 공지사항 긴 제목 모바일 2줄 표시 (`truncate` → `line-clamp-2`)
- [x] 공지사항 리스트 최소 터치 높이 보장 (`min-h-[44px]`)
- [x] 예배안내 카드 모바일 2컬럼 기본 적용 (`grid-cols-2`)
- [x] 타임라인 카드 모바일 너비 명시 (`w-[calc(100%-3.5rem)]`)
- [x] Footer 하위 메뉴 터치 영역 확대 (`py-1` 추가)
- [x] 공지사항 사이드바에서 불필요한 "최신 설교" 섹션 제거

### Phase 14: 콘텐츠 마이그레이션 스크립트
- [x] 설교 스크래핑 스크립트 (`scripts/scrape-sermons.mts`) — 기존 사이트에서 설교 데이터 + YouTube URL 추출
- [x] 공지사항 스크래핑 스크립트 (`scripts/scrape-notices.mts`) — 공지 제목/본문/날짜 추출
- [x] 교회앨범 스크래핑 스크립트 (`scripts/scrape-images.mts`) — 앨범 이미지 다운로드 + Sanity 업로드

---

## 남은 작업

### 사용자 작업 (수동 처리 필요)

| # | 작업 | 설명 |
|---|------|------|
| ~~1~~ | ~~**Vercel 배포 + DNS**~~ | ~~nammoon.or.kr 도메인 연결, 환경변수(KAKAO_MAP_KEY 등) 등록~~ **완료** |
| 2 | **카카오맵 플랫폼 등록** | Kakao Developers 콘솔에서 `https://nammoon.or.kr` 웹 플랫폼 추가 |
| 3 | **콘텐츠 마이그레이션 실행** | `npx tsx scripts/scrape-sermons.mts` 등 스크래핑 스크립트 실행하여 데이터 이관 |
| 4 | **이미지 업로드** | 교역자 사진, 히어로 배경 등 실제 이미지를 Sanity Studio에서 업로드 |

### 선택 작업

| # | 작업 | 설명 |
|---|------|------|
| 5 | **검색 기능** | 설교/공지 통합 검색 |

---

## 실행 명령어

```bash
# 개발
npm run dev              # localhost:3000

# 빌드/검증
npm run build            # 프로덕션 빌드
npm run lint             # ESLint
npm run type-check       # TypeScript

# 데이터
npx tsx scripts/seed.mts     # Sanity에 시드 데이터 투입
npx tsx scripts/cleanup.mts  # 테스트 데이터 삭제

# 콘텐츠 마이그레이션 (기존 사이트 → Sanity)
npx tsx scripts/scrape-sermons.mts --dry-run  # 설교 스크래핑 (미리보기)
npx tsx scripts/scrape-sermons.mts            # 설교 스크래핑 (실행)
npx tsx scripts/scrape-notices.mts --dry-run  # 공지사항 스크래핑 (미리보기)
npx tsx scripts/scrape-notices.mts            # 공지사항 스크래핑 (실행)
npx tsx scripts/scrape-images.mts --dry-run   # 앨범 스크래핑 (미리보기)
npx tsx scripts/scrape-images.mts             # 앨범 스크래핑 (실행)
```

## 주요 참고 파일

| 파일 | 역할 |
|------|------|
| `docs/PRD.md` | 전체 요구사항 문서 |
| `docs/admin-guide.md` | 관리자(담임목사/사무장) Sanity Studio 사용 가이드 |
| `CLAUDE.md` | Claude Code 작업 지침 |
| `src/lib/constants.ts` | NAV_ITEMS, SERMON_CATEGORY_LABELS |
| `src/types/sanity.ts` | 모든 Sanity 타입 정의 |
| `src/sanity/lib/queries.ts` | GROQ 쿼리 중앙 관리 |
| `src/components/blocks/BlockRenderer.tsx` | 블록→컴포넌트 매핑 |
| `src/app/globals.css` | CSS 변수 + Tailwind v4 테마 |
