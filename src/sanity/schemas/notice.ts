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
      description: '제목 입력 후 "Generate" 버튼을 눌러 자동 생성하세요.',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: '공지 내용',
      type: 'portableText',
      validation: (rule) => rule.required(),
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
    },
  },
})
