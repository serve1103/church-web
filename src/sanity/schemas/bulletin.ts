import { defineField, defineType } from 'sanity'

export const bulletin = defineType({
  name: 'bulletin',
  title: '주보',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '주보 제목',
      type: 'string',
      description: '예: 2026년 2월 22일 주보',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: '주보 날짜',
      type: 'date',
      description: '해당 주보의 주일 날짜를 선택하세요.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: '주보 파일',
      type: 'file',
      description: 'PDF 파일을 업로드해주세요. (10MB 이내)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: '표지 이미지',
      type: 'image',
      options: { hotspot: true },
      description: '주보 표지를 미리보기로 보여줍니다. (선택사항)',
    }),
  ],
  orderings: [
    {
      title: '날짜 (최신순)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'date',
      media: 'coverImage',
    },
  },
})
