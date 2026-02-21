import { defineField, defineType } from 'sanity'

export const imageGalleryBlock = defineType({
  name: 'imageGalleryBlock',
  title: '이미지 갤러리',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '제목',
      type: 'string',
    }),
    defineField({
      name: 'images',
      title: '이미지',
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
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '이미지 갤러리' }),
  },
})
