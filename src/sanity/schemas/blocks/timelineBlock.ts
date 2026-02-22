import { defineField, defineType } from 'sanity'

export const timelineBlock = defineType({
  name: 'timelineBlock',
  title: '연혁',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '홈페이지에 표시되는 이 섹션의 제목입니다.',
      initialValue: '교회 연혁',
    }),
    defineField({
      name: 'items',
      title: '연혁 항목',
      type: 'array',
      description: '연도와 내용을 추가하세요. (예: 1950년 - 남문교회 설립)',
      options: { sortable: false },
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'year',
              title: '연도',
              type: 'string',
              description: '예: 1950년, 2020년 3월',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'content',
              title: '내용',
              type: 'text',
              rows: 2,
              description: '해당 연도에 있었던 사건이나 변화를 작성하세요.',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'year', subtitle: 'content' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '연혁' }),
  },
})
