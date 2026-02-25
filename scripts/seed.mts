/**
 * 남문교회 시드 스크립트
 * 실제 교회 데이터를 기반으로 Sanity CMS에 예시 콘텐츠를 생성합니다.
 *
 * 실행: npx tsx scripts/seed.mts
 *
 * 환경변수:
 *   SANITY_WRITE_TOKEN — 쓰기 권한이 있는 Sanity API 토큰 (필수)
 *   또는 SANITY_API_READ_TOKEN — .env.local에 있는 토큰 (쓰기 권한이 있다면)
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// .env.local 파싱
const envPath = resolve(import.meta.dirname ?? ".", "..", ".env.local");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const k = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[k]) process.env[k] = v;
  }
} catch {
  // .env.local 없으면 환경변수에서 직접 읽음
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
// 토큰 우선순위: 환경변수 > Sanity CLI 인증 토큰
let token =
  process.env.SANITY_WRITE_TOKEN || "";

if (!token) {
  try {
    const configPath = resolve(
      process.env.HOME || "~",
      ".config",
      "sanity",
      "config.json"
    );
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    if (config.authToken) token = config.authToken;
  } catch {
    // CLI config 없으면 무시
  }
}

if (!token) {
  token = process.env.SANITY_API_READ_TOKEN || "";
}

if (!projectId || !dataset || !token) {
  console.error(
    "환경변수를 확인하세요: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

// ─── 헬퍼 ──────────────────────────────────────────────────

function key() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── 사역자 (Staff) ────────────────────────────────────────

const staffDocs = [
  {
    _id: "staff-lee-gunhee",
    _type: "staff",
    name: "이건희",
    position: "담임목사",
    bio: "2013년 임시목사 부임, 2015년 위임목사",
    order: 1,
  },
  {
    _id: "staff-lee-sunyong",
    _type: "staff",
    name: "이선용",
    position: "원로목사",
    bio: "2013년 원로목사 추대, 前 합신 총회장",
    order: 2,
  },
  {
    _id: "staff-han-sinil",
    _type: "staff",
    name: "한신일",
    position: "부목사",
    bio: "",
    order: 3,
  },
  {
    _id: "staff-kim-youngsang",
    _type: "staff",
    name: "김영상",
    position: "부목사",
    bio: "",
    order: 4,
  },
  {
    _id: "staff-kim-inhoo",
    _type: "staff",
    name: "김인후",
    position: "전도사",
    bio: "",
    order: 5,
  },
  {
    _id: "staff-kim-naan",
    _type: "staff",
    name: "김나안",
    position: "전도사",
    bio: "",
    order: 6,
  },
];

// ─── 설교 (Sermons) ────────────────────────────────────────

const sermonDocs = [
  {
    _id: "sermon-01",
    _type: "sermon",
    title: "영생의 말씀이 주께 있으니",
    slug: { _type: "slug", current: "eternal-word" },
    date: "2026-02-20",
    category: "dawn",
    preacher: "이건희 목사",
    bibleText: "요한복음 6:60-71",
    youtubeUrl: "https://www.youtube.com/watch?v=BHwoi5hd_4w",
  },
  {
    _id: "sermon-02",
    _type: "sermon",
    title: "예수 십자가의 은혜를 먹고 마시라",
    slug: { _type: "slug", current: "grace-of-the-cross" },
    date: "2026-02-16",
    category: "sunday",
    preacher: "이건희 목사",
    bibleText: "요한복음 6:41-59",
    youtubeUrl: "https://www.youtube.com/watch?v=d83SlWNXYP0",
  },
  {
    _id: "sermon-03",
    _type: "sermon",
    title: "예수님께 항상 나아가는 이상 예수님은 나를 버리지 않으신다",
    slug: { _type: "slug", current: "jesus-never-forsakes" },
    date: "2026-02-13",
    category: "dawn",
    preacher: "이건희 목사",
    bibleText: "요한복음 6:35-40",
    youtubeUrl: "https://www.youtube.com/watch?v=OVK21z-7dz4",
  },
  {
    _id: "sermon-04",
    _type: "sermon",
    title: "예수를 주로 믿다",
    slug: { _type: "slug", current: "believe-in-jesus-as-lord" },
    date: "2026-02-09",
    category: "sunday",
    preacher: "이건희 목사",
    bibleText: "요한복음 6:22-34",
    youtubeUrl: "https://www.youtube.com/watch?v=qS4LWNwnYfM",
  },
  {
    _id: "sermon-05",
    _type: "sermon",
    title: "무엇을 기대하며 예수님을 따르는가?",
    slug: { _type: "slug", current: "what-do-you-expect" },
    date: "2026-02-06",
    category: "dawn",
    preacher: "이건희 목사",
    bibleText: "요한복음 6:14-21",
    youtubeUrl: "https://www.youtube.com/watch?v=R9-Gx2kdfB0",
  },
  {
    _id: "sermon-06",
    _type: "sermon",
    title: "[룻, 충성으로 채운 삶] 충성으로 엎드리다",
    slug: { _type: "slug", current: "ruth-loyalty" },
    date: "2026-02-02",
    category: "sunday",
    preacher: "이건희 목사",
    bibleText: "룻기 2:1-13",
    youtubeUrl: "https://www.youtube.com/watch?v=5K21ivte7tY",
  },
];

// ─── 공지사항 (Notices) ─────────────────────────────────────

const noticeDocs = [
  {
    _id: "notice-01",
    _type: "notice",
    title: "2026년 공동의회 결과",
    slug: { _type: "slug", current: "2026-congregational-meeting" },
    category: "notice",
    body: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key(),
            text: "2026년 정기 공동의회가 2월 8일에 진행되었습니다. 주요 안건과 결의 사항을 안내드립니다.",
            marks: [],
          },
        ],
      },
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key(),
            text: "1. 2025년 결산 보고 및 승인\n2. 2026년 예산안 승인\n3. 임원 선출\n4. 기타 안건",
            marks: [],
          },
        ],
      },
    ],
    publishedAt: "2026-02-08T10:00:00.000Z",
    isPinned: true,
  },
  {
    _id: "notice-02",
    _type: "notice",
    title: "2024 남문교회 전교인수련회 설문조사 결과",
    slug: { _type: "slug", current: "2024-retreat-survey" },
    category: "notice",
    body: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key(),
            text: "2024년 전교인수련회에 참석해 주시고 설문조사에 응해 주신 모든 성도님께 감사드립니다. 설문 결과를 공유드립니다.",
            marks: [],
          },
        ],
      },
    ],
    publishedAt: "2024-09-28T10:00:00.000Z",
    isPinned: false,
  },
  {
    _id: "notice-03",
    _type: "notice",
    title: "[2024 교회설립기념 부흥사경회]",
    slug: { _type: "slug", current: "2024-revival-meeting" },
    category: "event",
    body: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key(),
            text: "남문교회 설립 43주년을 기념하여 부흥사경회를 개최합니다. 많은 참석 부탁드립니다.",
            marks: [],
          },
        ],
      },
    ],
    publishedAt: "2024-05-18T10:00:00.000Z",
    isPinned: false,
  },
  {
    _id: "notice-04",
    _type: "notice",
    title: "[2024 남문교회 윷놀이 대회]",
    slug: { _type: "slug", current: "2024-yut-game" },
    category: "event",
    body: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key(),
            text: "새해를 맞아 교회 가족이 함께하는 윷놀이 대회를 개최합니다. 맛있는 음식과 즐거운 시간이 준비되어 있습니다.",
            marks: [],
          },
        ],
      },
    ],
    publishedAt: "2024-02-23T10:00:00.000Z",
    isPinned: false,
  },
  {
    _id: "notice-05",
    _type: "notice",
    title: "2026년 새벽기도회 안내",
    slug: { _type: "slug", current: "2026-dawn-prayer" },
    category: "notice",
    body: [
      {
        _type: "block",
        _key: key(),
        style: "normal",
        markDefs: [],
        children: [
          {
            _type: "span",
            _key: key(),
            text: "새벽기도회가 매일 오전 5시 20분에 진행됩니다. 새벽마다 하나님 앞에 나아가 기도하는 은혜로운 시간에 함께해 주세요.",
            marks: [],
          },
        ],
      },
    ],
    publishedAt: "2026-01-05T10:00:00.000Z",
    isPinned: false,
  },
];

// ─── 사이트 설정 ────────────────────────────────────────────

const siteSettingsDoc = {
  _id: "siteSettings",
  _type: "siteSettings",
  churchName: "남문교회",
  address: "서울시 금천구 독산로 94가길 29 (독산3동 234-84)",
  phone: "02-862-0691",
};

// ─── 페이지 블록 데이터 ──────────────────────────────────────

const homePageDoc = {
  _id: "page-home",
  _type: "page",
  title: "홈",
  slug: { _type: "slug", current: "home" },
  seoDescription:
    "남문교회 - 이 땅을 품는 하늘 공동체. 대한예수교장로회(합신) 서울 금천구 독산동",
  blocks: [
    {
      _type: "heroBlock",
      _key: key(),
      title: "이 땅을 품는 하늘 공동체",
      subtitle: "NAMMOON CHURCH",
      buttonText: "교회 소개",
      buttonLink: "/about",
      backgroundImages: [], // 이미지는 Studio에서 직접 업로드
    },
    {
      _type: "quickLinkBlock",
      _key: key(),
      links: [
        {
          _key: key(),
          title: "교회 소개",
          description: "이 땅을 품는 하늘 공동체\n남문교회를 소개합니다",
          href: "/about",
          icon: "church",
        },
        {
          _key: key(),
          title: "변화 공동체",
          description:
            "기도와 말씀을 통해 주님이 원하시는 형상으로 변화되는 공동체",
          href: "/sermons",
          icon: "book",
        },
        {
          _key: key(),
          title: "영향력 공동체",
          description: "세상에서 그리스도인으로 영향력을 끼치는 공동체",
          href: "/notices",
          icon: "users",
        },
        {
          _key: key(),
          title: "세움 공동체",
          description: "다음 세대를 세우는 공동체",
          href: "/community",
          icon: "baby",
        },
      ],
    },
    {
      _type: "latestSermonBlock",
      _key: key(),
      heading: "최신 설교",
      count: 4,
    },
    {
      _type: "noticeListBlock",
      _key: key(),
      heading: "교회 소식",
      count: 5,
    },
    {
      _type: "worshipInfoBlock",
      _key: key(),
      heading: "예배 안내",
      services: [
        {
          _key: key(),
          name: "주일 1부 예배",
          time: "오전 8:45",
          location: "본당",
          icon: "sun",
        },
        {
          _key: key(),
          name: "주일 2부 예배",
          time: "오전 10:45",
          location: "본당",
          icon: "sun",
        },
        {
          _key: key(),
          name: "수요 예배",
          time: "오후 7:50",
          location: "본당",
          icon: "clock",
        },
        {
          _key: key(),
          name: "금요기도회 (WE)",
          time: "오후 9:00",
          location: "본당",
          icon: "moon",
        },
        {
          _key: key(),
          name: "새벽기도회",
          time: "오전 5:20",
          location: "본당",
          icon: "star",
        },
      ],
    },
  ],
};

// heroBlock의 backgroundImages가 비어있으면 필드 제거
const homeBlocks = homePageDoc.blocks.map((block) => {
  const cleaned = { ...block };
  if (
    "backgroundImages" in cleaned &&
    Array.isArray(cleaned.backgroundImages) &&
    cleaned.backgroundImages.length === 0
  ) {
    delete (cleaned as Record<string, unknown>).backgroundImages;
  }
  return cleaned;
});
homePageDoc.blocks = homeBlocks;

const aboutPageDoc = {
  _id: "page-about",
  _type: "page",
  title: "교회소개",
  slug: { _type: "slug", current: "about" },
  seoDescription:
    "남문교회 소개 - 인사말, 예배안내, 섬기는 사람들, 교회 연혁, 오시는 길",
  blocks: [
    {
      _type: "textBlock",
      _key: key(),
      heading: "인사말",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "남문교회에 오신 것을 환영합니다.",
              marks: ["strong"],
            },
          ],
        },
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: '남문교회는 1981년 6월 7일에 설립된 대한예수교장로회(합신) 소속 교회입니다. "이 땅을 품는 하늘 공동체"라는 비전 아래, 하나님의 말씀을 통해 변화되고 세상에 선한 영향력을 끼치는 공동체를 지향하고 있습니다.',
              marks: [],
            },
          ],
        },
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "우리 교회는 변화 공동체(예배와 말씀), 영향력 공동체(전도와 봉사), 세움 공동체(다음 세대 교육)의 세 가지 축으로 사역하고 있습니다. 누구나 환영합니다. 함께 예배하며 은혜를 나누는 자리에 여러분을 초대합니다.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _type: "worshipInfoBlock",
      _key: key(),
      heading: "예배 안내",
      services: [
        {
          _key: key(),
          name: "주일 1부 예배",
          time: "오전 8:45",
          location: "본당",
          icon: "sun",
        },
        {
          _key: key(),
          name: "주일 2부 예배",
          time: "오전 10:45",
          location: "본당",
          icon: "sun",
        },
        {
          _key: key(),
          name: "수요 예배",
          time: "오후 7:50",
          location: "본당",
          icon: "clock",
        },
        {
          _key: key(),
          name: "금요기도회 (WE)",
          time: "오후 9:00",
          location: "본당",
          icon: "moon",
        },
        {
          _key: key(),
          name: "새벽기도회",
          time: "오전 5:20",
          location: "본당",
          icon: "star",
        },
        {
          _key: key(),
          name: "유치부 예배",
          time: "주일 오전 10:45",
          location: "유치부실",
        },
        {
          _key: key(),
          name: "초등부 예배",
          time: "주일 오전 10:45",
          location: "초등부실",
        },
        {
          _key: key(),
          name: "중고등부 예배",
          time: "주일 오전 10:45",
          location: "중고등부실",
        },
        {
          _key: key(),
          name: "청년부 예배",
          time: "주일 오후 1:30",
          location: "청년부실",
        },
      ],
    },
    {
      _type: "staffBlock",
      _key: key(),
      heading: "섬기는 사람들",
      members: staffDocs.map((s) => ({
        _type: "reference",
        _ref: s._id,
        _key: key(),
      })),
    },
    {
      _type: "timelineBlock",
      _key: key(),
      heading: "교회 연혁",
      items: [
        { _key: key(), year: "1981", content: "6월 7일 남문교회 설립" },
        {
          _key: key(),
          year: "1981",
          content: "이선용 목사 부임 (초대 담임목사)",
        },
        {
          _key: key(),
          year: "1997",
          content: "현 교회 건물 건축 입당 예배",
        },
        {
          _key: key(),
          year: "2003",
          content: "교육관 증축 완공",
        },
        {
          _key: key(),
          year: "2011",
          content: "교회 설립 30주년 기념 예배",
        },
        {
          _key: key(),
          year: "2013",
          content: "이선용 목사 원로 추대, 이건희 목사 임시목사 부임",
        },
        {
          _key: key(),
          year: "2015",
          content: "이건희 목사 위임",
        },
        {
          _key: key(),
          year: "2017",
          content: "교회 리모델링 완공",
        },
        {
          _key: key(),
          year: "2021",
          content: "교회 설립 40주년 기념 예배",
        },
      ],
    },
    {
      _type: "directionsBlock",
      _key: key(),
      heading: "오시는 길",
      address: "서울시 금천구 독산로 94가길 29 (독산3동 234-84)",
      phone: "02-862-0691 / FAX 02-869-4639",
      transitInfo:
        "지하철: 1호선 독산역 2번 출구 도보 10분\n버스: 금천04 독산3동주민센터 하차",
      mapCoordinates: { lat: 37.4677, lng: 126.8958 },
    },
  ],
};

const communityPageDoc = {
  _id: "page-community",
  _type: "page",
  title: "공동체",
  slug: { _type: "slug", current: "community" },
  seoDescription:
    "남문교회 세움 공동체 - 유치부, 초등부, 중고등부, 청년부 소개",
  blocks: [
    {
      _type: "textBlock",
      _key: key(),
      heading: "세움 공동체",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "남문교회 세움 공동체는 다음 세대를 세우는 교육 공동체입니다. 유치부부터 청년부까지, 각 연령에 맞는 예배와 교육 프로그램을 통해 믿음의 다음 세대를 양육합니다.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _type: "textBlock",
      _key: key(),
      heading: "유치부",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "대상: 5-7세 어린이\n예배: 주일 오전 10:45\n장소: 유치부실\n\n하나님의 사랑을 놀이와 찬양으로 배우는 유치부 예배입니다. 성경 이야기, 율동 찬양, 만들기 활동을 통해 어린이들이 하나님을 즐겁게 만납니다.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _type: "textBlock",
      _key: key(),
      heading: "초등부",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "대상: 초등학생 1-6학년\n예배: 주일 오전 10:45\n장소: 초등부실\n\n말씀 암송, 공과 공부, 분반 나눔을 통해 성경의 가르침을 자신의 삶에 적용하는 법을 배웁니다.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _type: "textBlock",
      _key: key(),
      heading: "중고등부",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "대상: 중학생, 고등학생\n예배: 주일 오전 10:45\n장소: 중고등부실\n\n청소년들이 신앙 안에서 자신의 정체성을 발견하고, 또래 공동체 안에서 함께 성장합니다. 수련회, 전도 활동 등 다양한 프로그램이 있습니다.",
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _type: "textBlock",
      _key: key(),
      heading: "청년부",
      body: [
        {
          _type: "block",
          _key: key(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: key(),
              text: "대상: 대학생 및 청년\n예배: 주일 오후 1:30\n장소: 청년부실\n\n신앙과 삶의 현장을 연결하는 청년 공동체입니다. 예배, 소그룹 모임, 봉사 활동을 통해 사회 속에서 빛과 소금의 역할을 감당합니다.",
              marks: [],
            },
          ],
        },
      ],
    },
  ],
};

// ─── 실행 ───────────────────────────────────────────────────

async function seed() {
  console.log("🌱 남문교회 시드 데이터 생성을 시작합니다...\n");

  const transaction = client.transaction();

  // 사이트 설정
  console.log("  ✓ 사이트 설정");
  transaction.createOrReplace(siteSettingsDoc);

  // 사역자
  for (const doc of staffDocs) {
    console.log(`  ✓ 사역자: ${doc.name}`);
    transaction.createOrReplace(doc);
  }

  // 설교
  for (const doc of sermonDocs) {
    console.log(`  ✓ 설교: ${doc.title}`);
    transaction.createOrReplace(doc);
  }

  // 공지사항
  for (const doc of noticeDocs) {
    console.log(`  ✓ 공지: ${doc.title}`);
    transaction.createOrReplace(doc);
  }

  // 페이지
  console.log(`  ✓ 페이지: 홈`);
  transaction.createOrReplace(homePageDoc);
  console.log(`  ✓ 페이지: 교회소개`);
  transaction.createOrReplace(aboutPageDoc);
  console.log(`  ✓ 페이지: 공동체`);
  transaction.createOrReplace(communityPageDoc);

  console.log("\n⏳ Sanity에 커밋 중...");

  try {
    const result = await transaction.commit();
    console.log(
      `\n✅ 완료! ${result.documentIds.length}개 문서가 생성/업데이트되었습니다.`
    );
    console.log("\n📋 생성된 문서:");
    console.log("   - 사이트 설정: 1개");
    console.log(`   - 사역자: ${staffDocs.length}명`);
    console.log(`   - 설교: ${sermonDocs.length}개`);
    console.log(`   - 공지사항: ${noticeDocs.length}개`);
    console.log("   - 페이지: 3개 (홈, 교회소개, 공동체)");
    console.log(
      "\n💡 이미지는 Sanity Studio(/studio)에서 직접 업로드하세요."
    );
  } catch (err: unknown) {
    const error = err as Error & { statusCode?: number };
    if (error.statusCode === 403) {
      console.error(
        "\n❌ 권한 오류! 쓰기 가능한 토큰이 필요합니다."
      );
      console.error(
        "   Sanity 관리 페이지(https://sanity.io/manage)에서 API 토큰을 생성하세요."
      );
      console.error("   토큰 권한: Editor 이상");
      console.error(
        "   .env.local에 SANITY_WRITE_TOKEN=<토큰값> 을 추가하세요."
      );
    } else {
      console.error("\n❌ 오류 발생:", error.message);
    }
    process.exit(1);
  }
}

seed();
