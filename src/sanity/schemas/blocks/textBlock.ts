import { defineField, defineType } from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: '텍스트',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: '본문',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '텍스트 블록' }),
  },
})
