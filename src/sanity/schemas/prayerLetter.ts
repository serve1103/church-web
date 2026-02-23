import { defineField, defineType } from 'sanity'

export const prayerLetter = defineType({
  name: 'prayerLetter',
  title: '기도편지',
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
      title: '페이지 주소',
      type: 'slug',
      description: '제목 입력 후 "Generate" 버튼을 눌러 자동 생성하세요.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: '기도편지 내용',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'images',
      title: '첨부 사진',
      type: 'array',
      description: '기도편지와 함께 사진을 첨부할 수 있습니다.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: '사진 설명',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: '게시일',
      type: 'datetime',
      description: '기본값은 현재 시간입니다.',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: '게시일 (최신순)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'publishedAt',
    },
  },
})
