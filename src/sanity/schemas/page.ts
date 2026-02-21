import { defineField, defineType } from 'sanity'

export const page = defineType({
  name: 'page',
  title: '페이지',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '페이지 제목',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '슬러그',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO 설명',
      type: 'text',
      rows: 2,
      description: '검색엔진에 표시되는 페이지 설명 (160자 이내 권장)',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'blocks',
      title: '블록',
      type: 'array',
      of: [
        { type: 'heroBlock' },
        { type: 'worshipInfoBlock' },
        { type: 'latestSermonBlock' },
        { type: 'noticeListBlock' },
        { type: 'directionsBlock' },
        { type: 'youtubeBlock' },
        { type: 'textBlock' },
        { type: 'imageGalleryBlock' },
        { type: 'staffBlock' },
        { type: 'timelineBlock' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
})
