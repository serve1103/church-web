import { defineField, defineType } from 'sanity'

export const noticeListBlock = defineType({
  name: 'noticeListBlock',
  title: '공지사항 목록',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '홈페이지에 표시되는 이 섹션의 제목입니다.',
      initialValue: '공지사항',
    }),
    defineField({
      name: 'count',
      title: '표시 개수',
      type: 'number',
      description: '홈페이지에 보여줄 최신 공지 개수입니다. (1~20개)',
      initialValue: 5,
      validation: (rule) => rule.min(1).max(20),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '공지사항 목록' }),
  },
})
