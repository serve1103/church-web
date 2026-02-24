import { defineType, defineField } from 'sanity'

export const quickLinkBlock = defineType({
  name: 'quickLinkBlock',
  title: '퀵 링크',
  type: 'object',
  description: '주요 섹션으로 바로가기 카드 (교회소개, 변화공동체, 영향력공동체, 세움공동체 등)',
  fields: [
    defineField({
      name: 'links',
      title: '링크 목록',
      type: 'array',
      description: '최대 6개까지 추가 가능합니다.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: '제목',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: '설명',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'href',
              title: '링크 주소',
              type: 'string',
              description: '예: /about, /sermons, /community',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'icon',
              title: '아이콘',
              type: 'string',
              options: {
                list: [
                  { title: '교회', value: 'church' },
                  { title: '책 (변화)', value: 'book' },
                  { title: '사람들 (영향력)', value: 'users' },
                  { title: '아이 (세움)', value: 'baby' },
                  { title: '하트', value: 'heart' },
                  { title: '별', value: 'star' },
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'href',
            },
          },
        },
      ],
      validation: (rule) => rule.max(6),
    }),
  ],
  preview: {
    prepare() {
      return { title: '퀵 링크' }
    },
  },
})
