import { defineField, defineType } from 'sanity'

export const heroBlock = defineType({
  name: 'heroBlock',
  title: '히어로 배너',
  type: 'object',
  fields: [
    defineField({
      name: 'backgroundImages',
      title: '배경 이미지',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
      description:
        '페이지 상단에 크게 표시되는 배경 사진입니다. 가로로 넓은 사진이 좋습니다. 2장 이상이면 자동으로 슬라이드됩니다.',
      validation: (rule) => rule.required().min(1).max(5),
    }),
    defineField({
      name: 'title',
      title: '대표 문구',
      type: 'string',
      description: '배너 중앙에 크게 표시되는 텍스트입니다.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: '보조 문구',
      type: 'string',
      description: '대표 문구 아래에 작게 표시됩니다. (선택사항)',
    }),
    defineField({
      name: 'buttonText',
      title: '버튼 텍스트',
      type: 'string',
      description:
        '버튼에 표시할 텍스트입니다. (예: "예배 안내 보기") 비워두면 버튼이 표시되지 않습니다.',
    }),
    defineField({
      name: 'buttonLink',
      title: '버튼 링크',
      type: 'string',
      description: '버튼 클릭 시 이동할 경로입니다. (예: /worship)',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'subtitle' },
    prepare: ({ title, subtitle }) => ({
      title: title || '히어로 배너',
      subtitle,
    }),
  },
})
