/**
 * 기존 남문교회 사이트(nammoon.or.kr)에서 공지사항을 스크래핑하여
 * Sanity CMS에 notice 문서로 업로드하는 스크립트
 *
 * 실행: npx tsx scripts/scrape-notices.mts
 *
 * 옵션:
 *   --pages=N    스크래핑할 페이지 수 (기본: 전체, 최대 8페이지)
 *   --dry-run    실제 업로드하지 않고 데이터만 확인
 */

import { createClient } from "@sanity/client";
import * as cheerio from "cheerio";
import { readFileSync } from "fs";
import { resolve } from "path";

// ─── 환경변수 & Sanity 클라이언트 설정 ─────────────────────────

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
let token = process.env.SANITY_WRITE_TOKEN || "";

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

// ─── 상수 & 타입 ──────────────────────────────────────────────

const BASE_URL = "http://www.nammoon.or.kr";
const NOTICE_MID = "notice";

interface NoticeListItem {
  documentSrl: string;
  title: string;
  date: string; // YYYY.MM.DD 형식
  author: string;
}

interface NoticeData {
  documentSrl: string;
  title: string;
  publishedAt: string; // ISO 형식
  body: Array<{
    _type: "block";
    _key: string;
    style: string;
    markDefs: never[];
    children: Array<{
      _type: "span";
      _key: string;
      text: string;
      marks: never[];
    }>;
  }>;
  hasImage: boolean;
}

// ─── CLI 인자 파싱 ──────────────────────────────────────────────

const args = process.argv.slice(2);
const maxPages = (() => {
  const p = args.find((a) => a.startsWith("--pages="));
  return p ? parseInt(p.split("=")[1], 10) : Infinity;
})();
const dryRun = args.includes("--dry-run");

// ─── 헬퍼 함수 ─────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function key() {
  return Math.random().toString(36).slice(2, 10);
}

function toSlug(title: string, docSrl: string): string {
  const base = title
    .replace(/[^\w가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 60);
  return `${base}-${docSrl}`;
}

function parseDate(dateStr: string): string {
  // "2026.02.08" → "2026-02-08T00:00:00.000Z"
  // "2026.02.08 14:05" → "2026-02-08T14:05:00.000Z"
  const cleaned = dateStr.trim();
  const parts = cleaned.split(" ");
  const datePart = parts[0].replace(/\./g, "-");
  const timePart = parts[1] || "00:00";
  return `${datePart}T${timePart}:00.000Z`;
}

function textToPortableText(text: string) {
  // 텍스트를 Portable Text 블록으로 변환
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());

  if (paragraphs.length === 0) {
    return [
      {
        _type: "block" as const,
        _key: key(),
        style: "normal" as const,
        markDefs: [] as never[],
        children: [
          {
            _type: "span" as const,
            _key: key(),
            text: "",
            marks: [] as never[],
          },
        ],
      },
    ];
  }

  return paragraphs.map((p) => ({
    _type: "block" as const,
    _key: key(),
    style: "normal" as const,
    markDefs: [] as never[],
    children: [
      {
        _type: "span" as const,
        _key: key(),
        text: p.trim().replace(/\n/g, "\n"),
        marks: [] as never[],
      },
    ],
  }));
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return response.text();
}

// ─── 목록 페이지 스크래핑 ───────────────────────────────────────

async function scrapeNoticeList(
  page: number
): Promise<{ items: NoticeListItem[]; hasNext: boolean }> {
  const url = `${BASE_URL}/index.php?mid=${NOTICE_MID}&page=${page}`;
  console.log(`  페이지 ${page} 로드 중... (${url})`);

  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const items: NoticeListItem[] = [];

  // XE 게시판 테이블 구조: a.hx 링크를 기준으로 공지사항 아이템 찾기
  $("td.title a.hx, table tbody a.hx").each((_i, el) => {
    const $link = $(el);
    const href = $link.attr("href") || "";
    const title = $link.text().trim();

    // document_srl 추출
    const docSrlMatch =
      href.match(/document_srl=(\d+)/) || href.match(/\/notice\/(\d+)/);
    if (!docSrlMatch) return;
    const documentSrl = docSrlMatch[1];

    // 부모 tr에서 날짜, 작성자 추출
    const $row = $link.closest("tr");
    let date = "";
    let author = "";

    if ($row.length) {
      // 날짜: td.date 또는 4번째 td
      const dateCell = $row.find("td.date").first();
      date = dateCell.length
        ? dateCell.text().trim()
        : $row.find("td").eq(3).text().trim();

      // 작성자: td.author 또는 3번째 td
      const authorCell = $row.find("td.author").first();
      author = authorCell.length
        ? authorCell.text().trim()
        : $row.find("td").eq(2).text().trim();
    }

    if (title && documentSrl) {
      items.push({ documentSrl, title, date, author });
    }
  });

  // 다음 페이지 존재 여부
  const hasNext = $('a:contains("Next")').length > 0;

  return { items, hasNext };
}

// ─── 상세 페이지 스크래핑 ───────────────────────────────────────

async function scrapeNoticeDetail(
  documentSrl: string
): Promise<NoticeData | null> {
  const url = `${BASE_URL}/${NOTICE_MID}/${documentSrl}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // 제목
  const title = $("h1 a").first().text().trim();
  if (!title) return null;

  // 게시 날짜 (상세 페이지 상단)
  let publishedAt = "";
  const dateText = $(".rd_hd .date, .rd_hd .side, .btm_area .side")
    .first()
    .text()
    .trim();
  if (dateText) {
    publishedAt = parseDate(dateText);
  }

  // 날짜를 다른 위치에서도 시도
  if (!publishedAt) {
    // "2026.02.08 14:05" 같은 패턴 검색
    $(".rd_hd *").each((_i, el) => {
      const text = $(el).text().trim();
      const dateMatch = text.match(/(\d{4}\.\d{2}\.\d{2}\s*\d{2}:\d{2})/);
      if (dateMatch && !publishedAt) {
        publishedAt = parseDate(dateMatch[1]);
      }
    });
  }

  // 본문
  const article = $("article .xe_content, article .rd_body, article").first();
  let bodyText = "";
  let hasImage = false;

  if (article.length) {
    // 이미지 존재 여부 확인
    hasImage = article.find("img").length > 0;

    // 텍스트 추출 (이미지 태그 제거 후)
    const articleClone = article.clone();
    articleClone.find("img").remove();
    articleClone.find("script").remove();
    articleClone.find("style").remove();

    // 각 블록 요소에서 텍스트 추출
    const paragraphs: string[] = [];
    articleClone.find("p, div, li").each((_i, el) => {
      const text = $(el).text().trim();
      if (text) {
        paragraphs.push(text);
      }
    });

    if (paragraphs.length > 0) {
      bodyText = paragraphs.join("\n\n");
    } else {
      bodyText = articleClone.text().trim();
    }
  }

  // 본문이 비어있으면 기본 텍스트
  if (!bodyText) {
    bodyText = "(본문 내용 없음)";
  }

  const body = textToPortableText(bodyText);

  return {
    documentSrl,
    title,
    publishedAt:
      publishedAt || new Date().toISOString(),
    body,
    hasImage,
  };
}

// ─── 메인 실행 ──────────────────────────────────────────────────

async function main() {
  console.log("📢 남문교회 공지사항 스크래핑을 시작합니다...\n");
  if (dryRun) console.log("  (DRY RUN 모드 - 실제 업로드하지 않음)\n");

  const allListItems: NoticeListItem[] = [];
  let page = 1;
  let hasMore = true;

  // 1단계: 목록 수집
  console.log("📋 1단계: 공지사항 목록 수집 중...\n");

  while (hasMore && page <= maxPages) {
    try {
      const { items, hasNext } = await scrapeNoticeList(page);

      if (items.length === 0) {
        console.log(`  페이지 ${page}: 항목 없음 - 종료`);
        break;
      }

      console.log(`  페이지 ${page}: ${items.length}건 발견`);
      allListItems.push(...items);
      hasMore = hasNext;
      page++;

      await sleep(500);
    } catch (err) {
      console.error(`  페이지 ${page} 오류:`, (err as Error).message);
      break;
    }
  }

  console.log(`\n  총 ${allListItems.length}건의 공지사항 목록 수집 완료\n`);

  // 2단계: 상세 페이지 스크래핑
  console.log("🔍 2단계: 상세 페이지에서 본문 추출 중...\n");

  const notices: NoticeData[] = [];
  let detailCount = 0;

  for (const item of allListItems) {
    detailCount++;
    if (detailCount % 10 === 0) {
      console.log(
        `  진행: ${detailCount}/${allListItems.length} (${Math.round((detailCount / allListItems.length) * 100)}%)`
      );
    }

    try {
      const detail = await scrapeNoticeDetail(item.documentSrl);
      if (detail) {
        // 목록에서 가져온 날짜로 보강
        if (
          detail.publishedAt === new Date().toISOString() &&
          item.date
        ) {
          detail.publishedAt = parseDate(item.date);
        }
        notices.push(detail);
      }

      await sleep(300);
    } catch (err) {
      console.error(
        `  상세 페이지 오류 (${item.documentSrl}):`,
        (err as Error).message
      );
    }
  }

  console.log(`\n  ${notices.length}건의 공지사항 상세 정보 수집 완료\n`);

  if (notices.length === 0) {
    console.log("업로드할 공지사항이 없습니다.");
    return;
  }

  // 3단계: Sanity에 업로드
  if (dryRun) {
    console.log("📝 DRY RUN - 업로드 예정 데이터:\n");
    for (const n of notices.slice(0, 10)) {
      console.log(`  - ${n.publishedAt.substring(0, 10)} | ${n.title}`);
      const bodyPreview = n.body[0]?.children[0]?.text?.substring(0, 50);
      console.log(`    본문: ${bodyPreview}...`);
      console.log(`    이미지 포함: ${n.hasImage ? "예" : "아니오"}\n`);
    }
    if (notices.length > 10) {
      console.log(`  ... 외 ${notices.length - 10}건`);
    }
    return;
  }

  console.log("⬆️  3단계: Sanity에 업로드 중...\n");

  const BATCH_SIZE = 50;
  let uploadedCount = 0;

  for (let i = 0; i < notices.length; i += BATCH_SIZE) {
    const batch = notices.slice(i, i + BATCH_SIZE);
    const transaction = client.transaction();

    for (const notice of batch) {
      const slug = toSlug(notice.title, notice.documentSrl);
      const doc = {
        _id: `scraped-notice-${notice.documentSrl}`,
        _type: "notice" as const,
        title: notice.title,
        slug: { _type: "slug" as const, current: slug },
        category: "notice" as const,
        body: notice.body,
        publishedAt: notice.publishedAt,
        isPinned: false,
      };

      transaction.createOrReplace(doc);
    }

    try {
      const result = await transaction.commit();
      uploadedCount += result.documentIds.length;
      console.log(
        `  배치 ${Math.floor(i / BATCH_SIZE) + 1}: ${result.documentIds.length}건 업로드 완료`
      );
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number };
      if (error.statusCode === 403) {
        console.error("\n❌ 권한 오류! 쓰기 가능한 토큰이 필요합니다.");
        process.exit(1);
      }
      console.error(
        `  배치 오류: ${error.message} (${batch.length}건 건너뜀)`
      );
    }
  }

  console.log(
    `\n✅ 완료! ${uploadedCount}건의 공지사항이 Sanity에 업로드되었습니다.`
  );
}

main().catch((err) => {
  console.error("❌ 치명적 오류:", err);
  process.exit(1);
});
