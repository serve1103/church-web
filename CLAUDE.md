# 남문교회 홈페이지 프로젝트 컨벤션

## 프로젝트 개요
- 남문교회 홈페이지 리뉴얼 (XpressEngine → Next.js)
- Sanity CMS로 콘텐츠 관리 (비개발자가 관리자 화면에서 직접 작성)
- 상세 PRD: `docs/PRD.md`

## 기술 스택
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- CMS: Sanity (헤드리스 CMS, `next-sanity` 연동)
- 이미지: Sanity Image CDN + next/image
- 배포: Vercel
- 패키지 매니저: npm

## 코딩 컨벤션

### 파일/디렉토리
- 컴포넌트: `src/components/` 하위, PascalCase 파일명 (예: `Header.tsx`)
- 페이지: `src/app/` 하위, App Router 규칙 (page.tsx, layout.tsx)
- Sanity 스키마: `src/sanity/schemas/` 하위
- Sanity 설정: `src/sanity/lib/` 하위 (client, image, queries)
- 유틸리티: `src/lib/` 하위

### 컴포넌트
- 함수형 컴포넌트 + arrow function
- 'use client'는 꼭 필요한 경우에만 (기본은 Server Component)
- Props는 interface로 정의

### 스타일
- Tailwind CSS만 사용 (별도 CSS 파일 생성 금지)
- 글로벌 스타일: `src/styles/globals.css`의 @layer만 사용
- 반응형: mobile-first (sm → md → lg)

### 디자인 토큰
- Primary: `#1E3A5F` (네이비)
- Primary Light: `#4A90D9`
- Accent: `#C8A951` (골드)
- 본문 폰트: Pretendard, 최소 16px
- 최소 터치 영역: 44px

### 콘텐츠 (Sanity CMS)
- 동적 콘텐츠 (공지, 주보, 설교, 앨범 등): Sanity에서 관리
- 설교 영상: YouTube 임베드 방식 (Sanity에 URL 저장)
- 이미지: Sanity Image CDN 사용 (next-sanity의 urlFor 헬퍼)
- 정적 이미지 (로고 등): public/images/ 하위 관리
- 지도: 카카오맵 임베드

## 주의사항
- 다크모드 구현하지 않음
- 로그인/회원가입 기능 없음
- IE 지원하지 않음
- 한국어 전용 (다국어 불필요)
