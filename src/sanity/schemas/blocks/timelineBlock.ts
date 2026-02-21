import { defineField, defineType } from 'sanity'

export const timelineBlock = defineType({
  name: 'timelineBlock',
  title: '연혁',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
      initialValue: '교회 연혁',
    }),
    defineField({
      name: 'items',
      title: '연혁 항목',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: '연도',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'content',
              title: '내용',
              type: 'text',
              rows: 2,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'year', subtitle: 'content' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '연혁' }),
  },
})
