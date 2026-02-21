import { defineField, defineType } from 'sanity'

export const album = defineType({
  name: 'album',
  title: '사진앨범',
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
      name: 'description',
      title: '설명',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'images',
      title: '사진',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '대체 텍스트',
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
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
      media: 'images.0',
    },
  },
})
