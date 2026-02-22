import { defineField, defineType } from 'sanity'

export const worshipInfoBlock = defineType({
  name: 'worshipInfoBlock',
  title: '예배 안내',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '홈페이지에 표시되는 이 섹션의 제목입니다.',
      initialValue: '예배 안내',
    }),
    defineField({
      name: 'services',
      title: '예배 목록',
      type: 'array',
      description: '교회에서 진행하는 예배 정보를 추가하세요.',
      options: { sortable: false },
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'name',
              title: '예배명',
              type: 'string',
              description: '예: 주일예배, 수요예배, 금요기도회',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'time',
              title: '시간',
              type: 'string',
              description: '예: 오전 11:00, 저녁 7:30',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'location',
              title: '장소',
              type: 'string',
              description: '예: 본당, 교육관 (선택사항)',
            }),
            defineField({
              name: 'icon',
              title: '아이콘',
              type: 'string',
              description: '아이콘 이름입니다. 비워두면 기본 아이콘이 사용됩니다.',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'time' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '예배 안내' }),
  },
})
