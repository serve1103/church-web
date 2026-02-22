import { defineField, defineType } from 'sanity'

export const latestSermonBlock = defineType({
  name: 'latestSermonBlock',
  title: '최신 설교',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '홈페이지에 표시되는 이 섹션의 제목입니다.',
      initialValue: '최신 설교',
    }),
    defineField({
      name: 'count',
      title: '표시 개수',
      type: 'number',
      description: '홈페이지에 보여줄 최신 설교 개수입니다. (1~12개)',
      initialValue: 3,
      validation: (rule) => rule.min(1).max(12),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '최신 설교' }),
  },
})
