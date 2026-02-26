/**
 * 기존 남문교회 사이트(nammoon.or.kr)에서 주보 데이터를 스크래핑하여
 * Sanity CMS에 bulletin 문서로 업로드하는 스크립트
 *
 * 실행: npx tsx scripts/scrape-bulletins.mts
 *
 * 옵션:
 *   --pages=N    스크래핑할 페이지 수 (기본: 전체)
 *   --since=YYYY 해당 연도 이후 주보만 스크래핑 (예: --since=2025)
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

interface BulletinListItem {
  documentSrl: string;
  title: string;
  date: string; // YYYY.MM.DD
}

interface BulletinData {
  documentSrl: string;
  title: string;
  date: string; // YYYY-MM-DD
  imageUrls: string[];
  fileUrls: string[];
}

// ─── CLI 인자 파싱 ──────────────────────────────────────────────

const args = process.argv.slice(2);
const maxPages = (() => {
  const p = args.find((a) => a.startsWith("--pages="));
  return p ? parseInt(p.split("=")[1], 10) : Infinity;
})();
const sinceYear = (() => {
  const s = args.find((a) => a.startsWith("--since="));
  return s ? parseInt(s.split("=")[1], 10) : 0;
})();
const dryRun = args.includes("--dry-run");

// ─── 헬퍼 함수 ─────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${url}`);
  }
  return response.text();
}

// ─── 목록 페이지 스크래핑 ───────────────────────────────────────

async function scrapeBulletinList(
  page: number
): Promise<{ items: BulletinListItem[]; hasNext: boolean }> {
  const url = `${BASE_URL}/index.php?mid=jubo&page=${page}`;
  console.log(`  페이지 ${page} 로드 중... (${url})`);

  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const items: BulletinListItem[] = [];

  $("table.bd_lst tbody tr").each((_i, el) => {
    const $row = $(el);
    const $link = $row.find("td.title a").first();
    const href = $link.attr("href") || "";
    const title = $link.text().trim();

    const docSrlMatch =
      href.match(/document_srl=(\d+)/) || href.match(/\/jubo\/(\d+)/);
    if (!docSrlMatch) return;

    const dateText = $row.find("td.time, td:nth-child(4)").text().trim();

    items.push({
      documentSrl: docSrlMatch[1],
      title,
      date: dateText,
    });
  });

  const hasNext =
    $('a.pg_next, a:contains("다음")').length > 0 && items.length > 0;

  return { items, hasNext };
}

// ─── 상세 페이지 스크래핑 ───────────────────────────────────────

async function scrapeBulletinDetail(
  item: BulletinListItem
): Promise<BulletinData | null> {
  const url = `${BASE_URL}/index.php?mid=jubo&document_srl=${item.documentSrl}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // 날짜 파싱 (제목에서 추출: "2026.2.22 주보" → "2026-02-22")
  let date = "";
  const dateMatch = item.title.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})/);
  if (dateMatch) {
    const [, y, m, d] = dateMatch;
    date = `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  } else {
    // 게시일 기준
    const pubMatch = item.date.match(/(\d{4})\.(\d{2})\.(\d{2})/);
    if (pubMatch) {
      date = `${pubMatch[1]}-${pubMatch[2]}-${pubMatch[3]}`;
    }
  }

  if (!date) return null;

  // 본문 이미지 URL 추출
  const imageUrls: string[] = [];
  $("article img").each((_i, el) => {
    let src = $(el).attr("src") || "";
    if (src && !src.startsWith("http")) {
      src = `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
    }
    if (src && src.includes("/files/")) {
      imageUrls.push(src);
    }
  });

  // 첨부 파일 URL 추출
  const fileUrls: string[] = [];
  $("a[href*='procFileDownload']").each((_i, el) => {
    const href = $(el).attr("href") || "";
    if (href) {
      const fullUrl = href.startsWith("http") ? href : `${BASE_URL}${href}`;
      fileUrls.push(fullUrl);
    }
  });

  return {
    documentSrl: item.documentSrl,
    title: item.title.replace(/\s*주보\s*$/, "").trim() + " 주보",
    date,
    imageUrls,
    fileUrls,
  };
}

// ─── 메인 실행 ──────────────────────────────────────────────────

async function main() {
  console.log("📋 남문교회 주보 스크래핑을 시작합니다...\n");
  if (dryRun) console.log("  (DRY RUN 모드 - 실제 업로드하지 않음)\n");

  const allItems: BulletinListItem[] = [];
  let page = 1;
  let hasMore = true;

  // 1단계: 목록 수집
  console.log("📋 1단계: 주보 목록 수집 중...\n");

  while (hasMore && page <= maxPages) {
    try {
      const { items, hasNext } = await scrapeBulletinList(page);
      if (items.length === 0) {
        console.log(`  페이지 ${page}: 항목 없음 - 종료`);
        break;
      }
      console.log(`  페이지 ${page}: ${items.length}건 발견`);
      allItems.push(...items);
      hasMore = hasNext;
      page++;
      await sleep(500);
    } catch (err) {
      console.error(`  페이지 ${page} 오류:`, (err as Error).message);
      break;
    }
  }

  console.log(`\n  총 ${allItems.length}건의 주보 목록 수집 완료\n`);

  // 연도 필터
  if (sinceYear > 0) {
    const before = allItems.length;
    const filtered = allItems.filter((item) => {
      const yearMatch = item.title.match(/(\d{4})/);
      if (yearMatch) return parseInt(yearMatch[1], 10) >= sinceYear;
      const dateMatch = item.date.match(/(\d{4})/);
      return dateMatch ? parseInt(dateMatch[1], 10) >= sinceYear : true;
    });
    allItems.length = 0;
    allItems.push(...filtered);
    console.log(
      `  --since=${sinceYear} 필터 적용: ${before}건 → ${allItems.length}건\n`
    );
  }

  // 2단계: 상세 페이지 수집
  console.log("🔍 2단계: 상세 페이지에서 이미지/파일 추출 중...\n");

  const bulletins: BulletinData[] = [];
  for (let i = 0; i < allItems.length; i++) {
    if ((i + 1) % 10 === 0 || i === allItems.length - 1) {
      console.log(
        `  진행: ${i + 1}/${allItems.length} (${Math.round(((i + 1) / allItems.length) * 100)}%)`
      );
    }
    try {
      const detail = await scrapeBulletinDetail(allItems[i]);
      if (detail && (detail.imageUrls.length > 0 || detail.fileUrls.length > 0)) {
        bulletins.push(detail);
      }
      await sleep(300);
    } catch (err) {
      console.error(
        `  상세 오류 (${allItems[i].documentSrl}):`,
        (err as Error).message
      );
    }
  }

  console.log(`\n  ${bulletins.length}건의 주보 수집 완료\n`);

  if (bulletins.length === 0) {
    console.log("업로드할 주보가 없습니다.");
    return;
  }

  // 3단계: 업로드
  if (dryRun) {
    console.log("📝 DRY RUN - 업로드 예정 데이터:\n");
    for (const b of bulletins.slice(0, 10)) {
      console.log(`  - ${b.date} | ${b.title}`);
      console.log(`    본문 이미지: ${b.imageUrls.length}장, 첨부파일: ${b.fileUrls.length}개`);
    }
    if (bulletins.length > 10) {
      console.log(`  ... 외 ${bulletins.length - 10}건`);
    }
    return;
  }

  console.log("⬆️  3단계: Sanity에 업로드 중...\n");

  let uploadedCount = 0;

  for (let i = 0; i < bulletins.length; i++) {
    const b = bulletins[i];
    console.log(`  [${i + 1}/${bulletins.length}] "${b.title}"...`);

    try {
      // 첫 번째 이미지(또는 첨부파일)를 file로 업로드
      const primaryUrl = b.fileUrls[0] || b.imageUrls[0];
      if (!primaryUrl) continue;

      const response = await fetch(primaryUrl);
      if (!response.ok) {
        console.error(`    다운로드 실패: ${response.status}`);
        continue;
      }

      const buffer = Buffer.from(await response.arrayBuffer());
      const contentType = response.headers.get("content-type") || "image/jpeg";
      const ext = contentType.includes("pdf") ? "pdf" : "jpeg";

      // file 업로드
      const fileAsset = await client.assets.upload("file", buffer, {
        filename: `jubo-${b.date}.${ext}`,
        contentType,
      });

      // coverImage 업로드 (첫 번째 이미지)
      let coverAsset = null;
      const coverUrl = b.imageUrls[0];
      if (coverUrl) {
        const coverResponse = await fetch(coverUrl);
        if (coverResponse.ok) {
          const coverBuffer = Buffer.from(await coverResponse.arrayBuffer());
          coverAsset = await client.assets.upload("image", coverBuffer, {
            filename: `jubo-cover-${b.date}.jpeg`,
            contentType: "image/jpeg",
          });
        }
      }

      const doc: Record<string, unknown> = {
        _id: `scraped-bulletin-${b.documentSrl}`,
        _type: "bulletin",
        title: b.title,
        date: b.date,
        file: {
          _type: "file",
          asset: { _type: "reference", _ref: fileAsset._id },
        },
      };

      if (coverAsset) {
        doc.coverImage = {
          _type: "image",
          asset: { _type: "reference", _ref: coverAsset._id },
        };
      }

      await client.createOrReplace(
        doc as Parameters<typeof client.createOrReplace>[0]
      );
      uploadedCount++;
      console.log(`    업로드 완료`);

      await sleep(300);
    } catch (err: unknown) {
      const error = err as Error & { statusCode?: number };
      if (error.statusCode === 403) {
        console.error("\n❌ 권한 오류! 쓰기 가능한 토큰이 필요합니다.");
        process.exit(1);
      }
      console.error(`    오류: ${error.message}`);
    }
  }

  console.log(
    `\n✅ 완료! ${uploadedCount}건의 주보가 Sanity에 업로드되었습니다.`
  );
}

main().catch((err) => {
  console.error("❌ 치명적 오류:", err);
  process.exit(1);
});
