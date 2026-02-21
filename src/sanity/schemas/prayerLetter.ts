import { defineField, defineType } from 'sanity'

export const prayerLetter = defineType({
  name: 'prayerLetter',
  title: '기도편지',
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
      name: 'body',
      title: '내용',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: '게시일',
      type: 'datetime',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: '게시일 (최신순)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
    },
  },
})
