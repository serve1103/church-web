# 남문교회 홈페이지

대한예수교장로회(합신) 남문교회 공식 홈페이지.
기존 XpressEngine 기반 사이트를 Next.js + Sanity CMS로 리뉴얼한 프로젝트입니다.

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) + TypeScript |
| 스타일링 | Tailwind CSS v4 |
| CMS | Sanity v5 (Visual Editing, Presentation) |
| 배포 | Vercel |
| 패키지 매니저 | npm |

## 시작하기

### 사전 요구사항

- Node.js 18+
- npm

### 환경 변수

프로젝트 루트에 `.env.local` 파일을 생성하세요.

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=rrbx2hd9
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=<Sanity API 읽기 토큰>

# 카카오맵
NEXT_PUBLIC_KAKAO_MAP_KEY=<카카오맵 JavaScript 키>
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 (localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버
npm run start
```

### 코드 검증

```bash
npm run lint         # ESLint
npm run type-check   # TypeScript 타입 검사
```

## 프로젝트 구조

```
src/
├── app/                      # Next.js App Router
│   ├── (site)/               # 사이트 라우트 그룹
│   │   ├── page.tsx          # 홈
│   │   ├── about/            # 교회소개
│   │   ├── sermons/          # 설교 목록 + 상세
│   │   ├── notices/          # 공지사항 목록 + 상세
│   │   ├── bulletins/        # 주보 목록 + 뷰어
│   │   ├── albums/           # 교회앨범 목록 + 상세
│   │   ├── community/        # 교회 학교 (부서 소개)
│   │   ├── new-family/       # 새가족 소개
│   │   └── mission/          # 선교 (기도편지)
│   ├── studio/[[...tool]]/   # Sanity Studio (/studio)
│   └── globals.css           # CSS 변수 + Tailwind v4 테마
├── components/
│   ├── blocks/               # 블록 컴포넌트 (11종)
│   │   └── BlockRenderer.tsx # 블록 → 컴포넌트 매핑
│   ├── layout/               # Header, Footer, Navigation
│   └── ui/                   # 공통 UI 프리미티브
├── sanity/
│   ├── schemas/              # Sanity 스키마 정의
│   │   ├── documents/        # 문서 타입 (설교, 공지, 앨범 등)
│   │   └── blocks/           # 블록 스키마 (11종)
│   └── lib/
│       ├── client.ts         # Sanity 클라이언트
│       └── queries.ts        # GROQ 쿼리 (중앙 관리)
├── types/                    # TypeScript 타입 정의
│   └── sanity.ts
└── lib/
    └── constants.ts          # 메뉴 구조, 설교 카테고리 등 상수
```

## 블록 시스템

페이지는 재사용 가능한 블록을 조립하여 구성됩니다. Sanity Studio에서 블록을 추가/삭제/순서 변경할 수 있습니다.

| 블록 | 용도 |
|------|------|
| heroBlock | 대표 이미지 + 환영 문구 |
| worshipInfoBlock | 예배 시간표 카드 |
| latestSermonBlock | 최신 설교 (YouTube 임베드) |
| noticeListBlock | 최신 공지사항 미리보기 |
| directionsBlock | 지도 + 주소/교통편 |
| youtubeBlock | YouTube 영상 임베드 |
| textBlock | 리치 텍스트 영역 |
| imageGalleryBlock | 사진 그리드 갤러리 |
| staffBlock | 사역자 소개 카드 |
| timelineBlock | 연혁 타임라인 |
| quickLinkBlock | 바로가기 카드 그리드 |

새 블록 추가 시:
1. `src/sanity/schemas/blocks/<블록명>.ts` — 스키마
2. `src/components/blocks/<블록명>.tsx` — 컴포넌트
3. `src/components/blocks/BlockRenderer.tsx` — 매핑 등록
4. `src/types/sanity.ts` — 타입 정의

## 콘텐츠 관리 (Sanity Studio)

`/studio` 경로에서 Sanity Studio에 접속하여 콘텐츠를 관리합니다.

- **Visual Editing**: 실제 사이트 화면을 보면서 클릭으로 편집
- **Draft → Publish**: 발행 전까지 실제 사이트에 영향 없음
- 관리자 사용 가이드: `docs/admin-guide.md`

## 데이터 관리 스크립트

```bash
# 시드 데이터 투입
npx tsx scripts/seed.mts

# 테스트 데이터 정리
npx tsx scripts/cleanup.mts

# 기존 사이트에서 콘텐츠 마이그레이션
npx tsx scripts/scrape-sermons.mts --dry-run   # 설교 (미리보기)
npx tsx scripts/scrape-sermons.mts             # 설교 (실행)
npx tsx scripts/scrape-notices.mts             # 공지사항
npx tsx scripts/scrape-images.mts              # 교회앨범
```

## 문서

- [PRD (요구사항 문서)](docs/PRD.md)
- [프로젝트 현황](docs/STATUS.md)
- [관리자 가이드](docs/admin-guide.md)
- [CLAUDE.md](CLAUDE.md) — Claude Code 작업 지침

## 라이선스

Private
