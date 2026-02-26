import { defineField, defineType } from 'sanity'

export const notice = defineType({
  name: 'notice',
  title: '공지사항',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '공지 제목',
      type: 'string',
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: '페이지 주소',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      hidden: true,
    }),
    defineField({
      name: 'category',
      title: '분류',
      type: 'string',
      description: '공지사항의 분류를 선택하세요.',
      options: {
        list: [
          { title: '공지', value: 'notice' },
          { title: '행사', value: 'event' },
        ],
        layout: 'radio',
      },
      initialValue: 'notice',
    }),
    defineField({
      name: 'body',
      title: '공지 내용',
      type: 'portableText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attachments',
      title: '첨부파일',
      type: 'array',
      description: '관련 파일을 첨부할 수 있습니다.',
      of: [
        {
          type: 'file',
          fields: [
            {
              name: 'description',
              type: 'string',
              title: '파일 설명',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: '게시일',
      type: 'datetime',
      description: '공지가 게시되는 날짜입니다. 기본값은 현재 시간입니다.',
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'isPinned',
      title: '상단 고정',
      type: 'boolean',
      description: '켜면 공지사항 목록 최상단에 "중요" 배지와 함께 고정됩니다.',
      initialValue: false,
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
      category: 'category',
      isPinned: 'isPinned',
    },
    prepare({ title, subtitle, category, isPinned }) {
      const categoryLabel = category === 'event' ? '행사' : '공지'
      const pin = isPinned ? '📌 ' : ''
      return {
        title: `${pin}${title}`,
        subtitle: `[${categoryLabel}] ${subtitle ?? ''}`,
      }
    },
  },
})
