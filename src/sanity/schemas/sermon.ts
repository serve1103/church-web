import { defineField, defineType } from 'sanity'

export const sermon = defineType({
  name: 'sermon',
  title: '설교',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
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
      name: 'date',
      title: '날짜',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: '분류',
      type: 'string',
      options: {
        list: [
          { title: '주일설교', value: 'sunday' },
          { title: '수요설교', value: 'wednesday' },
          { title: '금요설교', value: 'friday' },
          { title: '특별설교', value: 'special' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'preacher',
      title: '설교자',
      type: 'string',
    }),
    defineField({
      name: 'bibleText',
      title: '성경본문',
      type: 'string',
      description: '예: 요한복음 3:16-18',
    }),
    defineField({
      name: 'youtubeUrl',
      title: 'YouTube URL',
      type: 'url',
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ['https', 'http'] })
          .custom((url) => {
            if (!url) return 'YouTube URL을 입력해주세요.'
            const pattern = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)/
            return pattern.test(url) || '유효한 YouTube URL을 입력해주세요.'
          }),
    }),
    defineField({
      name: 'thumbnail',
      title: '썸네일',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: '요약',
      type: 'text',
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: '날짜 (최신순)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'thumbnail',
    },
  },
})
