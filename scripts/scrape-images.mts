/**
 * 기존 남문교회 사이트(nammoon.or.kr)에서 교회 앨범 이미지를 스크래핑하여
 * Sanity CMS에 album 문서로 업로드하는 스크립트
 *
 * 실행: npx tsx scripts/scrape-images.mts
 *
 * 옵션:
 *   --pages=N    스크래핑할 페이지 수 (기본: 전체, 최대 19페이지)
 *   --dry-run    실제 업로드하지 않고 데이터만 확인
 *   --skip-upload-images  이미지 업로드 건너뛰고 앨범 문서만 생성 (이미지 없이)
 */

import { createClient, type SanityClient } from "@sanity/client";
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
const PHOTO_MID = "photo";

interface AlbumListItem {
  documentSrl: string;
  title: string;
  date: string; // YYYY/MM/DD 형식
}

interface ImageInfo {
  url: string;
  alt: string;
}

interface AlbumData {
  documentSrl: string;
  title: string;
  date: string; // YYYY-MM-DD 형식
  images: ImageInfo[];
}

// ─── CLI 인자 파싱 ──────────────────────────────────────────────

const args = process.argv.slice(2);
const maxPages = (() => {
  const p = args.find((a) => a.startsWith("--pages="));
  return p ? parseInt(p.split("=")[1], 10) : Infinity;
})();
const dryRun = args.includes("--dry-run");
const skipImageUpload = args.includes("--skip-upload-images");

// ─── 헬퍼 함수 ─────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

function parseAlbumDate(dateStr: string): string {
  // "2025/07/20" → "2025-07-20"
  // "2024/09/06" → "2024-09-06"
  return dateStr.replace(/\//g, "-");
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

/**
 * 이미지를 다운로드하여 Sanity에 업로드하고 asset reference를 반환
 */
async function uploadImageToSanity(
  sanityClient: SanityClient,
  imageUrl: string,
  filename: string
): Promise<{ _type: "image"; _key: string; asset: { _type: "reference"; _ref: string }; alt?: string } | null> {
  try {
    // 이미지 다운로드
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.error(`    이미지 다운로드 실패: ${response.status} ${imageUrl}`);
      return null;
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Sanity에 업로드
    const asset = await sanityClient.assets.upload("image", buffer, {
      filename,
      contentType,
    });

    return {
      _type: "image",
      _key: Math.random().toString(36).slice(2, 10),
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error(
      `    이미지 업로드 오류 (${imageUrl}):`,
      (err as Error).message
    );
    return null;
  }
}

// ─── 목록 페이지 스크래핑 ───────────────────────────────────────

async function scrapeAlbumList(
  page: number
): Promise<{ items: AlbumListItem[]; hasNext: boolean }> {
  const url = `${BASE_URL}/index.php?mid=${PHOTO_MID}&page=${page}`;
  console.log(`  페이지 ${page} 로드 중... (${url})`);

  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  const items: AlbumListItem[] = [];

  // 포토 게시판: a.hx.fixed 링크를 기준으로 앨범 아이템 찾기
  // 구조: <li> > <div.tmb_wrp> > <a class="hx fixed" href="/photo/XXXXX"> + <p><b>제목</b></p>
  $('a[class*="hx"]').each((_i, el) => {
    const $link = $(el);
    const href = $link.attr("href") || "";

    // /photo/ 경로의 링크만 처리
    const docSrlMatch =
      href.match(/document_srl=(\d+)/) || href.match(/\/photo\/(\d+)/);
    if (!docSrlMatch) return;
    const documentSrl = docSrlMatch[1];

    // 부모 li에서 제목과 날짜 추출
    const $li = $link.closest("li");
    if (!$li.length) return;

    // 제목: li > p > b 태그
    const title =
      $li.find("p b").first().text().trim() ||
      $li.find("p").last().text().trim();
    if (!title) return;

    // 날짜: b.tl 태그 (a 링크 내부)
    let date = "";
    const dateEl = $link.find("b.tl").first();
    if (dateEl.length) {
      date = dateEl.text().trim();
    }

    if (title && documentSrl) {
      items.push({ documentSrl, title, date });
    }
  });

  // 중복 제거 (같은 documentSrl)
  const uniqueItems = items.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.documentSrl === item.documentSrl)
  );

  const hasNext = $('a:contains("Next")').length > 0;

  return { items: uniqueItems, hasNext };
}

// ─── 상세 페이지에서 이미지 추출 ───────────────────────────────

async function scrapeAlbumDetail(
  documentSrl: string
): Promise<AlbumData | null> {
  const url = `${BASE_URL}/${PHOTO_MID}/${documentSrl}`;
  const html = await fetchPage(url);
  const $ = cheerio.load(html);

  // 제목
  const title = $("h1 a").first().text().trim();
  if (!title) return null;

  // 날짜 (상세 페이지 상단)
  let date = "";
  $(".rd_hd *").each((_i, el) => {
    const text = $(el).text().trim();
    const dateMatch = text.match(/(\d{4}\.\d{2}\.\d{2})/);
    if (dateMatch && !date) {
      date = dateMatch[1].replace(/\./g, "-");
    }
  });

  // 기본 날짜
  if (!date) {
    date = new Date().toISOString().substring(0, 10);
  }

  // 이미지 추출 (article 영역)
  const images: ImageInfo[] = [];
  $("article img").each((_i, el) => {
    const $img = $(el);
    let src = $img.attr("src") || "";

    // 상대 경로를 절대 경로로
    if (src && !src.startsWith("http")) {
      src = `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
    }

    // 유효한 이미지만 (이모지, 아이콘 등 제외)
    if (
      src &&
      src.includes("/files/") &&
      !src.includes("icon") &&
      !src.includes("emoji")
    ) {
      const alt = $img.attr("alt") || title;
      images.push({ url: src, alt });
    }
  });

  return {
    documentSrl,
    title,
    date,
    images,
  };
}

// ─── 메인 실행 ──────────────────────────────────────────────────

async function main() {
  console.log("📸 남문교회 교회 앨범 스크래핑을 시작합니다...\n");
  if (dryRun) console.log("  (DRY RUN 모드 - 실제 업로드하지 않음)\n");
  if (skipImageUpload)
    console.log("  (이미지 업로드 건너뛰기 모드)\n");

  const allListItems: AlbumListItem[] = [];
  let page = 1;
  let hasMore = true;

  // 1단계: 앨범 목록 수집
  console.log("📋 1단계: 앨범 목록 수집 중...\n");

  while (hasMore && page <= maxPages) {
    try {
      const { items, hasNext } = await scrapeAlbumList(page);

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

  console.log(`\n  총 ${allListItems.length}건의 앨범 목록 수집 완료\n`);

  // 2단계: 상세 페이지에서 이미지 URL 추출
  console.log("🔍 2단계: 상세 페이지에서 이미지 추출 중...\n");

  const albums: AlbumData[] = [];
  let detailCount = 0;
  let totalImages = 0;

  for (const item of allListItems) {
    detailCount++;
    if (detailCount % 5 === 0) {
      console.log(
        `  진행: ${detailCount}/${allListItems.length} (${Math.round((detailCount / allListItems.length) * 100)}%)`
      );
    }

    try {
      const detail = await scrapeAlbumDetail(item.documentSrl);
      if (detail && detail.images.length > 0) {
        // 목록에서 가져온 날짜로 보강
        if (item.date && !detail.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
          detail.date = parseAlbumDate(item.date);
        }
        albums.push(detail);
        totalImages += detail.images.length;
      } else if (detail) {
        console.log(`    ${item.title}: 이미지 없음 - 건너뜀`);
      }

      await sleep(300);
    } catch (err) {
      console.error(
        `  상세 페이지 오류 (${item.documentSrl}):`,
        (err as Error).message
      );
    }
  }

  console.log(
    `\n  ${albums.length}건의 앨범 (총 ${totalImages}장의 이미지) 수집 완료\n`
  );

  if (albums.length === 0) {
    console.log("업로드할 앨범이 없습니다.");
    return;
  }

  // 3단계: Sanity에 업로드
  if (dryRun) {
    console.log("📝 DRY RUN - 업로드 예정 데이터:\n");
    for (const a of albums.slice(0, 10)) {
      console.log(`  - ${a.date} | ${a.title} (${a.images.length}장)`);
      for (const img of a.images.slice(0, 3)) {
        console.log(`    이미지: ${img.url}`);
      }
      if (a.images.length > 3) {
        console.log(`    ... 외 ${a.images.length - 3}장`);
      }
      console.log();
    }
    if (albums.length > 10) {
      console.log(`  ... 외 ${albums.length - 10}건`);
    }
    return;
  }

  console.log("⬆️  3단계: Sanity에 업로드 중...\n");
  console.log(
    `  총 ${totalImages}장의 이미지를 다운로드하고 Sanity에 업로드합니다.`
  );
  console.log("  이미지 수에 따라 시간이 오래 걸릴 수 있습니다.\n");

  let uploadedCount = 0;

  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    console.log(
      `  [${i + 1}/${albums.length}] "${album.title}" (${album.images.length}장)...`
    );

    // 이미지 업로드
    const uploadedImages: Array<{
      _type: "image";
      _key: string;
      asset: { _type: "reference"; _ref: string };
      alt?: string;
    }> = [];

    if (!skipImageUpload) {
      for (let j = 0; j < album.images.length; j++) {
        const img = album.images[j];
        const filename = `album-${album.documentSrl}-${j + 1}`;

        const uploaded = await uploadImageToSanity(
          client,
          img.url,
          filename
        );
        if (uploaded) {
          // alt 텍스트 추가
          if (img.alt && img.alt !== album.title) {
            uploaded.alt = img.alt;
          }
          uploadedImages.push(uploaded);
        }

        // 이미지 업로드 간격
        await sleep(200);
      }

      console.log(
        `    ${uploadedImages.length}/${album.images.length}장 업로드 성공`
      );
    }

    // 앨범 문서 생성 (이미지가 최소 1장 이상)
    if (uploadedImages.length > 0 || skipImageUpload) {
      const slug = toSlug(album.title, album.documentSrl);
      const doc: Record<string, unknown> = {
        _id: `scraped-album-${album.documentSrl}`,
        _type: "album",
        title: album.title,
        slug: { _type: "slug", current: slug },
        date: album.date,
      };

      if (uploadedImages.length > 0) {
        doc.images = uploadedImages;
      }

      try {
        await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
        uploadedCount++;
      } catch (err: unknown) {
        const error = err as Error & { statusCode?: number };
        if (error.statusCode === 403) {
          console.error(
            "\n❌ 권한 오류! 쓰기 가능한 토큰이 필요합니다."
          );
          process.exit(1);
        }
        console.error(`    문서 생성 오류: ${error.message}`);
      }
    }
  }

  console.log(
    `\n✅ 완료! ${uploadedCount}건의 앨범이 Sanity에 업로드되었습니다.`
  );
}

main().catch((err) => {
  console.error("❌ 치명적 오류:", err);
  process.exit(1);
});
