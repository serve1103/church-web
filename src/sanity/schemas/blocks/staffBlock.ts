import { defineField, defineType } from 'sanity'

export const staffBlock = defineType({
  name: 'staffBlock',
  title: '사역자 소개',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '홈페이지에 표시되는 이 섹션의 제목입니다.',
      initialValue: '사역자 소개',
    }),
    defineField({
      name: 'members',
      title: '사역자 목록',
      type: 'array',
      description: '"관리 > 사역자"에서 먼저 등록한 후 여기서 선택하세요.',
      options: { sortable: false },
      of: [
        {
          type: 'reference',
          to: [{ type: 'staff' }],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '사역자 소개' }),
  },
})
