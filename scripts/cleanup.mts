/**
 * 기존 테스트 데이터 정리 스크립트
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
} catch {}

let token = process.env.SANITY_WRITE_TOKEN || "";
if (!token) {
  try {
    const configPath = resolve(process.env.HOME || "~", ".config", "sanity", "config.json");
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    if (config.authToken) token = config.authToken;
  } catch {}
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

// 삭제할 테스트 문서 ID들
const idsToDelete = [
  "d6399cf4-d455-4a4f-b95b-9ebeb2c13c7b", // 옛 home 페이지 "베너"
  "676d5001-8112-4132-995f-6c09f155db10",   // 테스트 설교 "2026년 2월 1주차"
  "e29e4e12-a7d0-45d0-b688-67431009b3ad",   // 테스트 설교 "2026년도 2월 2주차"
  "718ffcc4-44bc-49c4-94ef-10a9a7362207",   // 테스트 공지 "test 1"
  "8a276078-620b-4326-b808-bdb174c5d4b1",   // 테스트 공지 "test 2"
  "82acc83e-9d3c-4b2e-b3fb-b751d05ec61c",   // 테스트 사역자 "한재섭"
];

async function cleanup() {
  console.log("🧹 테스트 데이터 정리 시작...\n");

  const tx = client.transaction();
  for (const id of idsToDelete) {
    console.log(`  삭제: ${id}`);
    tx.delete(id);
  }

  try {
    await tx.commit();
    console.log(`\n✅ ${idsToDelete.length}개 테스트 문서 삭제 완료!`);
  } catch (err: unknown) {
    console.error("❌ 오류:", (err as Error).message);
    process.exit(1);
  }
}

cleanup();
