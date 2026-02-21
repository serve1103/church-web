import { defineField, defineType } from 'sanity'

export const notice = defineType({
  name: 'notice',
  title: '공지사항',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required().max(100),
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
    defineField({
      name: 'isPinned',
      title: '상단 고정',
      type: 'boolean',
      initialValue: false,
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
