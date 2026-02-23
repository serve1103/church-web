"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { schemaTypes } from "@/sanity/schemas";
import { dataset, projectId } from "@/sanity/env";

const structure = (S: StructureBuilder) =>
  S.list()
    .id("root")
    .title("남문교회")
    .items([
      // ── 콘텐츠 관리 ──
      S.listItem()
        .id("sermon")
        .title("설교")
        .icon(() => "🎬")
        .child(
          S.documentTypeList("sermon")
            .id("sermonList")
            .title("설교")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),
      S.listItem()
        .id("notice")
        .title("공지사항")
        .icon(() => "📢")
        .child(
          S.documentTypeList("notice")
            .id("noticeList")
            .title("공지사항")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),
      S.listItem()
        .id("bulletin")
        .title("주보")
        .icon(() => "📄")
        .child(
          S.documentTypeList("bulletin")
            .id("bulletinList")
            .title("주보")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),
      S.listItem()
        .id("album")
        .title("교회앨범")
        .icon(() => "📸")
        .child(
          S.documentTypeList("album")
            .id("albumList")
            .title("교회앨범")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),
      S.listItem()
        .id("prayerLetter")
        .title("기도편지")
        .icon(() => "✉️")
        .child(
          S.documentTypeList("prayerLetter")
            .id("prayerLetterList")
            .title("기도편지")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
        ),

      S.divider(),

      // ── 사이트 관리 ──
      S.listItem()
        .id("staff")
        .title("사역자")
        .icon(() => "👤")
        .child(
          S.documentTypeList("staff")
            .id("staffList")
            .title("사역자")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .id("page")
        .title("페이지 관리")
        .icon(() => "📃")
        .child(S.documentTypeList("page").id("pageList").title("페이지 관리")),
    ]);

export default defineConfig({
  name: "nammun-church",
  title: "남문교회",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({
      structure,
    }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
