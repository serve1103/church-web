import { defineField, defineType } from 'sanity'

export const latestSermonBlock = defineType({
  name: 'latestSermonBlock',
  title: '최신 설교',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
      initialValue: '최신 설교',
    }),
    defineField({
      name: 'count',
      title: '표시 개수',
      type: 'number',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(12),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '최신 설교' }),
  },
})
