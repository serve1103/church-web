# 남문교회 홈페이지 프로젝트 컨벤션

## 프로젝트 개요
- 남문교회 홈페이지 리뉴얼 (XpressEngine → Next.js)
- Sanity CMS로 콘텐츠 관리 (비개발자가 관리자 화면에서 직접 작성)
- YouTube 채널: [@official남문교회](https://www.youtube.com/@official%EB%82%A8%EB%AC%B8%EA%B5%90%ED%9A%8C)
- 유지보수: 개발자가 AI 도움을 받아 직접 관리
- 상세 PRD: `docs/PRD.md`

## 기술 스택
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- CMS: Sanity (헤드리스 CMS, `next-sanity` 연동)
- Visual Editing: `@sanity/presentation` + `@sanity/visual-editing`
- 이미지: Sanity Image CDN + next/image
- 배포: Vercel
- 패키지 매니저: npm

## 아키텍처 원칙
1. **명확한 디렉토리 구조**: 파일 위치만 보고 역할을 알 수 있어야 함
2. **타입 안전성**: Sanity 스키마 ↔ TypeScript 타입 일치
3. **컴포넌트 단일 책임**: 하나의 컴포넌트 = 하나의 역할
4. **블록 확장성**: 새 블록 = 스키마 1개 + 컴포넌트 1개만 추가
5. **테마 변경 용이**: CSS 변수 기반, 한 곳만 수정하면 전체 반영
6. **쿼리 분리**: GROQ 쿼리는 `src/sanity/lib/queries.ts`에서 중앙 관리

## 코딩 컨벤션

### 파일/디렉토리
- 컴포넌트: `src/components/` 하위, PascalCase 파일명 (예: `Header.tsx`)
- 페이지: `src/app/` 하위, App Router 규칙 (page.tsx, layout.tsx)
- Sanity 스키마: `src/sanity/schemas/` 하위
- Sanity 설정: `src/sanity/lib/` 하위 (client, image, queries)
- 유틸리티: `src/lib/` 하위
- 타입 정의: `src/types/` 하위

### 컴포넌트
- 함수형 컴포넌트 + arrow function
- 'use client'는 꼭 필요한 경우에만 (기본은 Server Component)
- Props는 interface로 정의

### 스타일
- Tailwind CSS만 사용 (별도 CSS 파일 생성 금지)
- 글로벌 스타일: `src/styles/globals.css`의 @layer만 사용
- 반응형: mobile-first (sm → md → lg)
- **컬러는 반드시 CSS 변수 사용** (하드코딩 금지)

### 디자인 토큰 (CSS 변수)
```css
:root {
  --color-primary: #1E3A5F;       /* 네이비 */
  --color-primary-light: #4A90D9; /* 라이트 블루 */
  --color-accent: #C8A951;        /* 골드 */
  --color-bg: #FFFFFF;
  --color-surface: #F8F9FA;
  --color-text: #1A1A1A;
  --color-text-secondary: #6B7280;
}
```
- Tailwind에서 `theme.extend.colors`에 CSS 변수 매핑
- 본문 폰트: Pretendard, 최소 16px
- 최소 터치 영역: 44px

### 콘텐츠 (Sanity CMS)
- 동적 콘텐츠 (공지, 주보, 설교, 앨범 등): Sanity에서 관리
- 페이지 구성: 블록(모듈) 조립 방식 (Sanity array of objects)
- Visual Editing: 각 컴포넌트에 `encodeDataAttribute` 적용하여 클릭-편집 연동
- 설교 영상: YouTube 임베드 방식 (Sanity에 URL 저장)
- 이미지: Sanity Image CDN 사용 (next-sanity의 urlFor 헬퍼)
- 정적 이미지 (로고 등): public/images/ 하위 관리
- 지도: 카카오맵 임베드

### 블록 추가 시 체크리스트
1. `src/sanity/schemas/blocks/` 에 스키마 파일 생성
2. `src/components/blocks/` 에 렌더링 컴포넌트 생성
3. `src/components/blocks/BlockRenderer.tsx` 에 매핑 추가
4. `src/types/` 에 타입 정의 추가

## 주의사항
- 다크모드 구현하지 않음
- 로그인/회원가입 기능 없음 (관리자는 Sanity 로그인)
- IE 지원하지 않음
- 한국어 전용 (다국어 불필요)
- 관리자 화면: PC 전용 (모바일 관리 미지원)
- 컬러를 하드코딩하지 않음 (반드시 CSS 변수 또는 Tailwind 토큰 사용)
