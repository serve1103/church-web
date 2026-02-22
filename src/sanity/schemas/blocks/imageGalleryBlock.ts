import { defineField, defineType } from 'sanity'

export const imageGalleryBlock = defineType({
  name: 'imageGalleryBlock',
  title: '이미지 갤러리',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '갤러리 위에 표시되는 제목입니다. (선택사항)',
    }),
    defineField({
      name: 'images',
      title: '이미지 목록',
      type: 'array',
      description: '갤러리에 표시할 이미지를 업로드하세요. 최소 1장 이상 필요합니다.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '사진 설명',
              description: '시각장애인을 위한 사진 설명입니다. (선택사항)',
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
