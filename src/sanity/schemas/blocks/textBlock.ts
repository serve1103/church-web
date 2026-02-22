import { defineField, defineType } from 'sanity'

export const textBlock = defineType({
  name: 'textBlock',
  title: '텍스트',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: '섹션 제목',
      type: 'string',
      description: '본문 위에 표시되는 제목입니다. (선택사항)',
    }),
    defineField({
      name: 'body',
      title: '본문 내용',
      type: 'portableText',
      description: '글자 굵기, 기울임, 링크 등의 서식을 적용할 수 있습니다.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || '텍스트 블록' }),
  },
})
