import { defineField, defineType } from 'sanity'

export const worshipInfoBlock = defineType({
  name: 'worshipInfoBlock',
  title: '예배 안내',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
      initialValue: '예배 안내',
    }),
    defineField({
      name: 'services',
      title: '예배 목록',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: '예배명',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'time',
              title: '시간',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'location',
              title: '장소',
              type: 'string',
            }),
            defineField({
              name: 'icon',
              title: '아이콘',
              type: 'string',
              description: '아이콘 이름 (예: church, book, music)',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'time' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '예배 안내' }),
  },
})
