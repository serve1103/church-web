import { defineField, defineType } from 'sanity'

export const album = defineType({
  name: 'album',
  title: '사진앨범',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '앨범 제목',
      type: 'string',
      description: '예: 2026년 부활절 예배',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: '페이지 주소',
      type: 'slug',
      description: '제목 입력 후 "Generate" 버튼을 눌러 자동 생성하세요.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: '촬영 날짜',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: '앨범 설명',
      type: 'text',
      rows: 2,
      description: '앨범에 대한 간단한 설명입니다. (선택사항)',
    }),
    defineField({
      name: 'images',
      title: '사진 목록',
      type: 'array',
      description: '사진을 업로드하세요. 최소 1장 이상 필요합니다.',
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
