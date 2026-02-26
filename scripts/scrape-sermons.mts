/**
 * 기존 남문교회 사이트(nammoon.or.kr)에서 설교 데이터를 스크래핑하여
 * Sanity CMS에 sermon 문서로 업로드하는 스크립트
 *
 * 실행: npx tsx scripts/scrape-sermons.mts
 *
 * 옵션:
 *   --pages=N        스크래핑할 페이지 수 (기본: 전체)
 *   --category=ID    특정 카테고리만 스크래핑 (223=주일오전, 224=주일오후, 225=수요, 226=새벽, 227=특별, 19193=3분메시지)
 *   --dry-run        실제 업로드하지 않고 데이터만 확인
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
const SERMON_MID = "Sunday01";

// XE 카테고리 ID → Sanity 카테고리 매핑
const CATEGORY_MAP: Record<string, string> = {
  "223": "sunday",    // 주일오전설교
  "224": "seminar",   // 주일오후세미나
  "225": "wednesday", // 수요예배설교
  "226": "dawn",      // 새벽예배설교
  "227": "special",   // 특별예배설교
  "19193": "message", // 3분 메시지
};

// XE 카테고리 한글 이름 → Sanity 카테고리 매핑
const CATEGORY_NAME_MAP: Record<string, string> = {
  "주일오전설교": "sunday",
  "주일 오후 세미나 및 신학강의": "seminar",
  "주일오후설교": "seminar",
  "수요예배설교": "wednesday",
  "새벽예배설교": "dawn",
  "특별예배설교": "special",
  "3분 메시지": "message",
  "3분메시지": "message",
};

interface SermonData {
  title: string;
  date: string;
  preacher: string;
  bibleText: string;
  category: string;
  youtubeUrl: string;
  documentSrl: string;
}

// ─── CLI 인자 파싱 ──────────────────────────────────────────────

const args = process.argv.slice(2);
const maxPages = (() => {
  const p = args.find((a) => a.startsWith("--pages="));
  return p ? parseInt(p.split("=")[1], 10) : Infinity;
})();
const filterCategory = (() => {
  const c = args.find((a) => a.startsWith("--category="));
  return c ? c.split("=")[1] : null;
})();
const dryRun = args.includes("--dry-run");

// ─── 헬퍼 함수 ─────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanBibleText(text: string): string {
  // XE 게시판에서 주제말씀 필드에 YouTube 메타데이터 등 노이즈가
  // 섞여 들어간 경우를 정리한다.
  // 예: "요 6:16-29 남문교회 Official 구독자 866명 분석 동영상 수정 11"
  //   → "요 6:16-29"
  let cleaned = text.trim();

  // "남문교회" 이후의 YouTube 채널 메타데이터 제거
  const noiseIdx = cleaned.indexOf("남문교회");
  if (noiseIdx > 0) {
    cleaned = cleaned.substring(0, noiseIdx).trim();
  }

  // "Official", "구독자", "분석", "동영상" 등 YouTube 관련 단어가 포함된 경우 제거
  cleaned = cleaned
    .replace(/\s+(Official|구독자|분석|동영상|수정|조회)\s*.*$/i, "")
    .trim();

  // 끝에 남은 숫자만 있는 경우 제거 (예: "창 1:1 15" → "창 1:1")
  // 단, "창 1:1-15" 같은 절 범위는 유지
  cleaned = cleaned.replace(/\s+\d+\s*$/, "").trim();

  return cleaned;
}

function toSlug(title: string, docSrl: string): string {
  // 간단한 slug 생성: document_srl을 활용
  const base = title
    .replace(/[^\w가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .substring(0, 60);
  return `${base}-${docSrl}`;
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

async function scrapeSermonList(
  page: number,
  categoryId?: string
): Promise<{ items: SermonData[]; hasNext: boolean }> {
  let url = `${BASE_URL}/index.php?mid=${SERMON_MID}&page=${page}`;
  if (categoryId) {
    url += `&category=${categoryId}`;
  }

  console.log(`  페이지 ${page} 로드 중... (${url})`);
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const items: SermonData[] = [];

  // 설교 목록 아이템 파싱
  // XE Sketchbook5 스킨: <ol class="bd_lst ..."> <li class="clear">
  // a.hx 링크를 기준으로 설교 아이템을 찾음 (가장 안정적)
  $("a.hx").each((_i, el) => {
    const $link = $(el);
    const href = $link.attr("href") || "";

    // document_srl 추출 (URL 패턴: ...&document_srl=38147 또는 /Sunday01/38147)
    const docSrlMatch =
      href.match(/document_srl=(\d+)/) || href.match(/\/(\d+)(?:\?|$)/);
    if (!docSrlMatch) return;
    const documentSrl = docSrlMatch[1];

    // a.hx의 부모 li 요소에서 정보 추출
    const $el = $link.closest("li");
    if (!$el.length) return;

    // 제목
    const title = $el.find("h3").first().text().trim();
    if (!title) return;

    // 메타 정보 (info 영역의 span 들)
    const infoSpans = $el.find(".info span");
    let category = "";
    let preacher = "";
    let bibleText = "";
    let date = "";

    infoSpans.each((_j, span) => {
      const $span = $(span);
      const text = $span.text().trim();

      if (text.startsWith("Category") || text.includes("Category")) {
        const catName = $span.find("b").text().trim();
        category = CATEGORY_NAME_MAP[catName] || "";
      } else if (text.startsWith("설교자")) {
        preacher = $span.find("b").text().trim();
      } else if (text.startsWith("주제말씀")) {
        bibleText = cleanBibleText($span.find("b").text().trim());
      } else if (text.startsWith("설교일시")) {
        date = $span.find("b").text().trim();
      }
    });

    if (title && documentSrl) {
      items.push({
        title,
        date,
        preacher,
        bibleText,
        category,
        youtubeUrl: "", // 상세 페이지에서 추출
        documentSrl,
      });
    }
  });

  // 다음 페이지 존재 여부
  const hasNext = $('a:contains("Next")').length > 0;

  return { items, hasNext };
}

// ─── 상세 페이지에서 YouTube URL 추출 ──────────────────────────

async function scrapeSermonDetail(
  documentSrl: string
): Promise<{
  youtubeUrl: string;
  category: string;
  date: string;
  preacher: string;
  bibleText: string;
}> {
  const url = `${BASE_URL}/${SERMON_MID}/${documentSrl}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // YouTube iframe에서 URL 추출
  let youtubeUrl = "";
  const iframe = $("article iframe").first();
  if (iframe.length) {
    const src = iframe.attr("src") || "";
    const embedMatch = src.match(
      /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
    );
    if (embedMatch) {
      youtubeUrl = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    }
  }

  // 만약 iframe이 없으면 article 내 YouTube 링크 찾기
  if (!youtubeUrl) {
    $("article a").each((_i, el) => {
      const href = $(el).attr("href") || "";
      if (href.includes("youtube.com/watch") || href.includes("youtu.be/")) {
        youtubeUrl = href;
        return false; // break
      }
    });
  }

  // Extra Form 테이블에서 메타 정보 보강
  let category = "";
  let date = "";
  let preacher = "";
  let bibleText = "";

  $("table caption").each((_i, el) => {
    if ($(el).text().trim() === "Extra Form") {
      const $table = $(el).closest("table");
      $table.find("tr").each((_j, row) => {
        const header = $(row).find("th").text().trim();
        const value = $(row).find("td").text().trim();
        if (header === "설교일시") date = value;
        if (header === "설교자") preacher = value;
        if (header === "주제말씀") bibleText = cleanBibleText(value);
      });
    }
  });

  // 카테고리: 상세 페이지 상단 strong 태그
  const catText = $(".rd_hd strong").first().text().trim();
  if (catText && CATEGORY_NAME_MAP[catText]) {
    category = CATEGORY_NAME_MAP[catText];
  }

  return { youtubeUrl, category, date, preacher, bibleText };
}

// ─── 메인 실행 ──────────────────────────────────────────────────

async function main() {
  console.log("🎤 남문교회 설교 스크래핑을 시작합니다...\n");
  if (dryRun) console.log("  (DRY RUN 모드 - 실제 업로드하지 않음)\n");

  const allSermons: SermonData[] = [];
  let page = 1;
  let hasMore = true;

  // 1단계: 목록 페이지에서 기본 정보 수집
  console.log("📋 1단계: 설교 목록 수집 중...\n");

  while (hasMore && page <= maxPages) {
    try {
      const { items, hasNext } = await scrapeSermonList(
        page,
        filterCategory || undefined
      );

      if (items.length === 0) {
        console.log(`  페이지 ${page}: 항목 없음 - 종료`);
        break;
      }

      console.log(`  페이지 ${page}: ${items.length}건 발견`);
      allSermons.push(...items);
      hasMore = hasNext;
      page++;

      // 서버 부담 방지
      await sleep(500);
    } catch (err) {
      console.error(`  페이지 ${page} 오류:`, (err as Error).message);
      break;
    }
  }

  console.log(`\n  총 ${allSermons.length}건의 설교 목록 수집 완료\n`);

  // 2단계: 각 설교의 상세 페이지에서 YouTube URL 등 추출
  console.log("🔍 2단계: 상세 페이지에서 YouTube URL 추출 중...\n");

  let detailCount = 0;
  let skipCount = 0;

  for (const sermon of allSermons) {
    detailCount++;
    if (detailCount % 10 === 0) {
      console.log(
        `  진행: ${detailCount}/${allSermons.length} (${Math.round((detailCount / allSermons.length) * 100)}%)`
      );
    }

    try {
      const detail = await scrapeSermonDetail(sermon.documentSrl);
      if (detail.youtubeUrl) {
        sermon.youtubeUrl = detail.youtubeUrl;
      }
      // 상세 페이지 데이터가 더 정확하므로, 있으면 항상 덮어씀
      // (목록 페이지의 info span에는 노이즈가 섞일 수 있음)
      if (detail.category) {
        sermon.category = detail.category;
      }
      if (detail.date) {
        sermon.date = detail.date;
      }
      if (detail.preacher) {
        sermon.preacher = detail.preacher;
      }
      if (detail.bibleText) {
        sermon.bibleText = detail.bibleText;
      }

      if (!sermon.youtubeUrl) {
        skipCount++;
      }

      // 서버 부담 방지
      await sleep(300);
    } catch (err) {
      console.error(
        `  상세 페이지 오류 (${sermon.documentSrl}):`,
        (err as Error).message
      );
      skipCount++;
    }
  }

  // YouTube URL이 있는 설교만 필터링 (필수 필드)
  const validSermons = allSermons.filter((s) => s.youtubeUrl);
  console.log(
    `\n  유효한 설교: ${validSermons.length}건 (YouTube 없는 설교 ${skipCount}건 제외)\n`
  );

  if (validSermons.length === 0) {
    console.log("업로드할 설교가 없습니다.");
    return;
  }

  // 3단계: Sanity에 업로드
  if (dryRun) {
    console.log("📝 DRY RUN - 업로드 예정 데이터:\n");
    for (const s of validSermons.slice(0, 10)) {
      console.log(`  - ${s.date} | ${s.category} | ${s.title}`);
      console.log(`    설교자: ${s.preacher} | 본문: ${s.bibleText}`);
      console.log(`    YouTube: ${s.youtubeUrl}\n`);
    }
    if (validSermons.length > 10) {
      console.log(`  ... 외 ${validSermons.length - 10}건`);
    }
    return;
  }

  console.log("⬆️  3단계: Sanity에 업로드 중...\n");

  // 트랜잭션 크기 제한 (한 번에 최대 100개씩)
  const BATCH_SIZE = 100;
  let uploadedCount = 0;

  for (let i = 0; i < validSermons.length; i += BATCH_SIZE) {
    const batch = validSermons.slice(i, i + BATCH_SIZE);
    const transaction = client.transaction();

    for (const sermon of batch) {
      const slug = toSlug(sermon.title, sermon.documentSrl);
      const doc = {
        _id: `scraped-sermon-${sermon.documentSrl}`,
        _type: "sermon" as const,
        title: sermon.title,
        slug: { _type: "slug" as const, current: slug },
        date: sermon.date,
        category: sermon.category || "sunday",
        preacher: sermon.preacher || undefined,
        bibleText: sermon.bibleText || undefined,
        youtubeUrl: sermon.youtubeUrl,
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

  console.log(`\n✅ 완료! ${uploadedCount}건의 설교가 Sanity에 업로드되었습니다.`);
}

main().catch((err) => {
  console.error("❌ 치명적 오류:", err);
  process.exit(1);
});
