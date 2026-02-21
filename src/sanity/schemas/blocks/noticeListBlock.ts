import { defineField, defineType } from 'sanity'

export const noticeListBlock = defineType({
  name: 'noticeListBlock',
  title: '공지사항 목록',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
      initialValue: '공지사항',
    }),
    defineField({
      name: 'count',
      title: '표시 개수',
      type: 'number',
      initialValue: 5,
      validation: (rule) => rule.min(1).max(20),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '공지사항 목록' }),
  },
})
