"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import {
  defineLocations,
  presentationTool,
  type DocumentLocation,
} from "sanity/presentation";
import { media } from "sanity-plugin-media";
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
        .id("siteSettings")
        .title("사이트 설정")
        .icon(() => "⚙️")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings"),
        ),
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
    presentationTool({
      name: "presentation",
      title: "미리보기",
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
      resolve: {
        mainDocuments: [
          {
            route: "/",
            filter: `_type == "page" && slug.current == "home"`,
          },
          {
            route: "/:slug",
            filter: `_type == "page" && slug.current == $slug`,
          },
          {
            route: "/sermons/:slug",
            filter: `_type == "sermon" && slug.current == $slug`,
          },
          {
            route: "/notices/:slug",
            filter: `_type == "notice" && slug.current == $slug`,
          },
          {
            route: "/albums/:slug",
            filter: `_type == "album" && slug.current == $slug`,
          },
          {
            route: "/mission/prayer-letters/:slug",
            filter: `_type == "prayerLetter" && slug.current == $slug`,
          },
        ],
        locations: {
          page: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "페이지",
                  href: doc?.slug === "home" ? "/" : `/${doc?.slug}`,
                },
              ],
            }),
          }),
          sermon: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "설교",
                  href: `/sermons/${doc?.slug}`,
                },
                { title: "설교 목록", href: "/sermons" },
              ],
            }),
          }),
          notice: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "공지사항",
                  href: `/notices/${doc?.slug}`,
                },
                { title: "공지사항 목록", href: "/notices" },
              ],
            }),
          }),
          album: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "앨범",
                  href: `/albums/${doc?.slug}`,
                },
                { title: "앨범 목록", href: "/albums" },
              ],
            }),
          }),
          bulletin: defineLocations({
            select: { title: "title", date: "date" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "주보",
                  href: "/bulletins",
                },
              ],
            }),
          }),
          prayerLetter: defineLocations({
            select: { title: "title", slug: "slug.current" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || "기도편지",
                  href: `/mission/prayer-letters/${doc?.slug}`,
                },
                { title: "기도편지 목록", href: "/mission/prayer-letters" },
              ],
            }),
          }),
          staff: defineLocations({
            select: { name: "name" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || "사역자",
                  href: "/about",
                },
              ] as DocumentLocation[],
            }),
          }),
          siteSettings: defineLocations({
            message: "사이트 전체에 적용되는 설정입니다",
            tone: "caution",
            locations: [{ title: "홈페이지", href: "/" }],
          }),
        },
      },
    }),
    structureTool({
      name: "structure",
      title: "콘텐츠",
      structure,
    }),
    media(),
  ],
  tools: (prev) =>
    prev.map((tool) =>
      tool.name === "media" ? { ...tool, title: "미디어" } : tool,
    ),
  schema: {
    types: schemaTypes,
  },
});
