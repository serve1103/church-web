import { defineField, defineType } from 'sanity'

export const staffBlock = defineType({
  name: 'staffBlock',
  title: '사역자 소개',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
      initialValue: '사역자 소개',
    }),
    defineField({
      name: 'members',
      title: '사역자 목록',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'staff' }],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '사역자 소개' }),
  },
})
