# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 지침입니다.

## 프로젝트 개요

남문교회 홈페이지 리뉴얼 (XpressEngine → Next.js + Sanity CMS). 상세 요구사항은 `docs/PRD.md` 참고.

## 명령어

```bash
npm run dev          # Next.js 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 검사
npm run type-check   # TypeScript 타입 검사 (tsc --noEmit)
```

Sanity Studio는 `/studio` 경로에 임베드 (별도 프로젝트 아님).

## 기술 스택

- **Next.js 15** (App Router) + TypeScript + Tailwind CSS
- **Sanity** CMS (`next-sanity`, `@sanity/presentation`, `@sanity/visual-editing`)
- **Vercel** 배포, **npm** 패키지 매니저

## 아키텍처

### 데이터 흐름

```
Sanity CMS (콘텐츠) → GROQ 쿼리 → Next.js Server Components → UI
                                    ↕
                      Sanity Visual Editing (Draft Mode, /studio)
```

### 블록 시스템

페이지는 재사용 가능한 **블록**(Sanity array of objects)을 조립하여 구성. 새 블록 추가 시:

1. 스키마: `src/sanity/schemas/blocks/<블록명>.ts`
2. 컴포넌트: `src/components/blocks/<블록명>.tsx`
3. 매핑 등록: `src/components/blocks/BlockRenderer.tsx`
4. 타입 정의: `src/types/`

### 주요 디렉토리

- `src/sanity/schemas/` — Sanity 콘텐츠 타입 및 블록 스키마 정의
- `src/sanity/lib/queries.ts` — 모든 GROQ 쿼리 중앙 관리 (컴포넌트에 분산 금지)
- `src/sanity/lib/client.ts` — Sanity 클라이언트 설정
- `src/components/blocks/` — 블록 렌더링 컴포넌트, `BlockRenderer.tsx`에서 매핑
- `src/components/layout/` — Header, Footer, Navigation
- `src/components/ui/` — 공통 UI 프리미티브 (버튼, 카드 등)
- `src/types/` — Sanity 스키마에 대응하는 TypeScript 타입
- `src/app/studio/[[...tool]]/` — Sanity Studio 임베드 라우트

## 코딩 컨벤션

### 컴포넌트
- 함수형 컴포넌트 + arrow function, 기본은 Server Component
- `'use client'`는 인터랙션/훅이 필요한 경우에만
- Props는 `interface`로 정의

### 스타일
- Tailwind CSS만 사용 (별도 CSS 파일 생성 금지)
- 글로벌 스타일: `src/styles/globals.css`에서 `@layer`만 사용
- 반응형: mobile-first (`sm → md → lg`)
- **컬러 하드코딩 금지** — 반드시 CSS 변수 또는 Tailwind 테마 토큰 사용

### 테마 시스템 (CSS 변수)

모든 컬러는 `:root`의 CSS 커스텀 프로퍼티로 관리하고, `tailwind.config.ts`의 `theme.extend.colors`에 매핑. 사이트 컬러를 변경하려면 `globals.css`의 `:root` 변수만 수정.

```css
:root {
  --color-primary: #1E3A5F;
  --color-primary-light: #4A90D9;
  --color-accent: #C8A951;
  --color-bg: #FFFFFF;
  --color-surface: #F8F9FA;
  --color-text: #1A1A1A;
  --color-text-secondary: #6B7280;
}
```

### Sanity 콘텐츠
- 동적 콘텐츠 (공지, 설교, 앨범, 주보 등): Sanity에서 관리
- 설교 영상: YouTube 임베드 (Sanity에 URL 저장)
- 이미지: Sanity Image CDN (`next-sanity`의 `urlFor` 헬퍼)
- 정적 이미지 (로고 등): `public/images/`
- 지도: 카카오맵 임베드

### 디자인 제약
- 본문 폰트: Pretendard, 최소 16px
- 최소 터치 영역: 44px
- 다크모드 없음, 다국어 없음, 사용자 인증 없음
- 관리자(Sanity Studio): PC 전용
- 한국어 전용
