import { defineField, defineType } from 'sanity'

export const bulletin = defineType({
  name: 'bulletin',
  title: '주보',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '제목',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: '날짜',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'file',
      title: '파일',
      type: 'file',
      description: 'PDF 파일을 업로드해주세요. (10MB 이내)',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: '표지 이미지',
      type: 'image',
      options: { hotspot: true },
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
