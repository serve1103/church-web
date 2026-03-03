"use client";

import { defineConfig, defineLocaleResourceBundle } from "sanity";
import { structureTool } from "sanity/structure";
import type { StructureBuilder } from "sanity/structure";
import {
  defineLocations,
  presentationTool,
  type DocumentLocation,
} from "sanity/presentation";
import { koKRLocale } from "@sanity/locale-ko-kr";
import { media } from "sanity-plugin-media";
import { schemaTypes } from "@/sanity/schemas";
import { dataset, projectId } from "@/sanity/env";
import { createAutoSlugPublishAction } from "@/sanity/lib/actions";

const presentationLocaleKo = defineLocaleResourceBundle({
  locale: "ko-KR",
  namespace: "presentation",
  resources: {
    "document-list-pane.document-list.title": "이 페이지의 문서",
    "locations-banner.locations-count_one": "1개 페이지에서 사용됨",
    "locations-banner.locations-count_other": "{{count}}개 페이지에서 사용됨",
    "locations-banner.locations-count_zero": "사용된 페이지 없음",
    "locations-banner.resolving.text": "위치 확인 중...",
    "preview-frame.overlay.toggle-button.text": "편집",
    "preview-frame.overlay.toggle-button.tooltip_disable": "편집 오버레이 끄기",
    "preview-frame.overlay.toggle-button.tooltip_enable": "편집 오버레이 켜기",
    "preview-frame.refresh-button.aria-label": "미리보기 새로고침",
    "preview-frame.refresh-button.tooltip": "미리보기 새로고침",
    "preview-frame.status_connecting": "연결 중.",
    "preview-frame.status_loading": "불러오는 중.",
    "preview-frame.status_refreshing": "새로고침 중.",
    "preview-frame.status_reloading": "새로고침 중.",
    "preview-frame.viewport-button.aria-label": "화면 크기 전환",
    "preview-frame.viewport-button.tooltip_full": "전체 화면으로 전환",
    "preview-frame.viewport-button.tooltip_narrow": "좁은 화면으로 전환",
    "share-url.menu-item.open.text": "미리보기 열기",
    "preview-frame.share-button.aria-label": "미리보기 공유",
    "error-card.continue-button.text": "계속 진행",
    "error-card.retry-button.text": "다시 시도",
    "error-card.title": "오류가 발생했습니다",
    "main-document.label": "메인 문서",
  },
});

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
      S.listItem()
        .id("newFamily")
        .title("새가족")
        .icon(() => "🤝")
        .child(
          S.documentTypeList("newFamily")
            .id("newFamilyList")
            .title("새가족")
            .defaultOrdering([{ field: "date", direction: "desc" }]),
        ),

      S.divider(),

      // ── 관리 ──
      S.listItem()
        .id("manage")
        .title("관리")
        .icon(() => "⚙️")
        .child(
          S.list()
            .id("manageList")
            .title("관리")
            .items([
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
            ]),
        ),
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
          newFamily: defineLocations({
            select: { name: "name" },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || "새가족",
                  href: "/new-family",
                },
              ] as DocumentLocation[],
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
    koKRLocale(),
  ],
  tools: (prev) =>
    prev.map((tool) =>
      tool.name === "media" ? { ...tool, title: "미디어" } : tool,
    ),
  i18n: {
    bundles: [presentationLocaleKo],
  },
  schema: {
    types: schemaTypes,
  },
  document: {
    actions: (prev, context) => {
      const autoSlugTypes = ["sermon", "notice", "album", "prayerLetter"];
      if (autoSlugTypes.includes(context.schemaType)) {
        return prev.map((action) =>
          action.action === "publish"
            ? createAutoSlugPublishAction(action)
            : action,
        );
      }
      return prev;
    },
  },
});
