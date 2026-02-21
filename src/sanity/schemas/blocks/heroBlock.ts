import { defineField, defineType } from 'sanity'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: '히어로 배너',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImage',
      title: '배경 이미지',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: '부제목',
      type: 'string',
    }),
    defineField({
      name: 'buttonText',
      title: '버튼 텍스트',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: '버튼 링크',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
    prepare: ({ title, subtitle }) => ({
      title: title || '히어로 배너',
      subtitle,
    }),
  },
})
