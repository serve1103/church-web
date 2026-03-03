# 새가족 페이지 개선: 안내 섹션 + 디테일 모달

## 개요

현재 `/new-family` 페이지는 사진+이름+등록번호 카드 그리드만 있고, CMS에서 편집 가능한 안내 정보가 없음.

### 개선 목표

1. **CMS 편집 가능한 안내 섹션** — 환영 인사말, 등록 절차, 담당 교역자
2. **카드 간소화** — 사진+이름만 표시, 클릭 시 모달로 세부정보(등록일, 등록번호, 추가정보) 표시

## 접근 방식

**새 싱글톤 문서 `newFamilySettings`** 생성하여 안내 콘텐츠 관리.

- `siteSettings`에 추가하지 않는 이유: 페이지 전용 콘텐츠이므로 분리가 깔끔함
- Sanity Studio "관리" 그룹 안에 "새가족 안내" 항목으로 노출

## 수정 파일 목록

| # | 파일 | 작업 | 설명 |
|---|------|------|------|
| 1 | `src/sanity/schemas/newFamilySettings.ts` | **생성** | 싱글톤 스키마 (welcomeMessage, registrationSteps, assignedStaff) |
| 2 | `src/sanity/schemas/index.ts` | 수정 | newFamilySettings 스키마 등록 |
| 3 | `sanity.config.ts` | 수정 | 관리 그룹에 "새가족 안내" 추가 + presentation locations 추가 |
| 4 | `src/types/sanity.ts` | 수정 | NewFamilyRegistrationStep, NewFamilySettings 인터페이스 추가 |
| 5 | `src/sanity/lib/queries.ts` | 수정 | newFamilySettingsQuery 추가 |
| 6 | `src/components/new-family/NewFamilyIntro.tsx` | **생성** | 안내 섹션 Server Component |
| 7 | `src/components/new-family/NewFamilyGrid.tsx` | **생성** | 카드 그리드 Client Component (사진+이름만, 클릭→모달) |
| 8 | `src/components/new-family/NewFamilyDetailModal.tsx` | **생성** | 세부정보 모달 Client Component |
| 9 | `src/app/(site)/new-family/page.tsx` | 수정 | 안내 섹션 + 새 그리드 컴포넌트 통합 |

## 구현 상세

### 1. Sanity 스키마 — `newFamilySettings.ts`

싱글톤 문서 (`siteSettings`와 동일한 패턴):

```typescript
// 필드 구조
{
  welcomeMessage: portableText       // 환영 인사말 (리치텍스트)
  registrationSteps: [               // 등록 절차 (배열)
    { stepNumber: number, title: string, description: string }
  ]
  assignedStaff: [reference to staff] // 담당 교역자 (Staff 문서 참조)
}
```

- `welcomeMessage`: 기존 `portableText` 타입 재사용 (리치텍스트 편집 가능)
- `registrationSteps`: `stepNumber`(숫자), `title`(제목), `description`(설명)으로 구성된 배열
- `assignedStaff`: `staff` 문서에 대한 참조 배열 (`staffBlock`과 동일한 패턴)

### 2. Desk Structure — `sanity.config.ts`

"관리" 그룹(`manageList`)에 사이트 설정과 사역자 사이에 추가:

```
관리
├── 사이트 설정
├── 새가족 안내  ← 추가 (싱글톤, documentId: "newFamilySettings")
└── 사역자
```

Presentation Tool `locations`에 `newFamilySettings` 추가 (미리보기 연동):

```typescript
newFamilySettings: defineLocations({
  message: "새가족 페이지 안내 설정입니다",
  tone: "caution",
  locations: [{ title: "새가족", href: "/new-family" }],
})
```

### 3. GROQ 쿼리 — `queries.ts`

```groq
*[_type == "newFamilySettings"][0]{
  welcomeMessage,
  registrationSteps,
  assignedStaff[]->{ _id, name, position, photo }
}
```

- `assignedStaff[]->`로 Staff 문서 디레퍼런스 (`pageBySlugQuery`의 `staffBlock members[]->` 패턴)

### 4. TypeScript 타입 — `sanity.ts`

```typescript
export interface NewFamilyRegistrationStep {
  _key: string;
  stepNumber: number;
  title: string;
  description: string;
}

export interface NewFamilySettings {
  welcomeMessage?: PortableTextBlock[];
  registrationSteps?: NewFamilyRegistrationStep[];
  assignedStaff?: Staff[];
}
```

### 5. 안내 섹션 컴포넌트 — `NewFamilyIntro.tsx`

Server Component. 세 섹션을 조건부 렌더링:

| 섹션 | 내용 | 참고 패턴 |
|------|------|-----------|
| 환영 인사말 | `<PortableText>` 리치텍스트 | `TextBlock.tsx` |
| 등록 절차 | 번호 뱃지 + 제목 + 설명 카드 그리드 | 커스텀 |
| 담당 교역자 | 원형 사진 + 이름/직분 | `StaffBlock.tsx` |

- CMS에 데이터가 없으면 전체 섹션 안 보임 (null guard)
- 데이터가 하나도 없으면 컴포넌트 자체가 렌더링되지 않음

### 6. 카드 그리드 — `NewFamilyGrid.tsx`

`'use client'` 컴포넌트:

- **카드 표시**: 사진 + 이름만 (등록번호 제거)
- **카드 요소**: `<button>`으로 변경 (접근성, 클릭 가능 영역)
- **인터랙션**: hover 시 scale 효과, focus 링
- **상태 관리**: `useState`로 선택된 멤버 → 모달 조건부 렌더링

### 7. 디테일 모달 — `NewFamilyDetailModal.tsx`

`'use client'` 컴포넌트. `ImageLightbox.tsx` 패턴 재사용:

- `fixed inset-0 z-50` 오버레이 (배경: `bg-black/60`)
- Escape 키로 닫기 + `document.body.style.overflow` 잠금
- 배경 클릭으로 닫기 + `e.stopPropagation()`
- 모달 내용:
  - 큰 사진 (aspect-[3/4], 최대 너비 제한)
  - 이름 (제목)
  - `<dl>` 형식으로 등록일, 등록번호, extraFields 표시
- 닫기 버튼 (X 아이콘, `lucide-react` 사용)

### 8. 페이지 통합 — `page.tsx`

`Promise.all`에 `newFamilySettingsQuery` fetch 추가 (병렬):

```
<PageHeader />
<NewsTabNav />
<NewFamilyIntro settings={settings} />    ← 새로 추가
<필터/토글 UI>                             ← 기존 유지
<NewFamilyGrid members={members} />       ← 기존 div 그리드 대체
<Pagination />                            ← 기존 유지
```

## 검증 체크리스트

- [ ] `npm run type-check` — TypeScript 타입 오류 없음
- [ ] `npm run lint` — ESLint 통과
- [ ] `/new-family` 페이지 정상 로드
- [ ] Sanity Studio "관리 > 새가족 안내" 진입 확인
- [ ] 안내 데이터 없을 때 안내 섹션 안 보이는 것 확인
- [ ] 카드 클릭 시 모달 열림/닫힘 (Esc, 배경 클릭)
- [ ] 모달에 등록일, 등록번호, extraFields 표시 확인
- [ ] 모바일 반응형 동작 확인
